import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { domainEvents, auditLog, processedCommands, sites, organizations } from "@stoker/db";
import { createTestDb } from "../test-utils/testDb";
import { CommandHandler, CommandContext } from "./command";
import { runCommand } from "./runCommand";
import { assertPermission, assertSiteInScope } from "./permissions";
import { buildSiteScopeCondition } from "@stoker/db";
import { ForbiddenError, ValidationError } from "./errors";
import { generateId } from "./ids";

// Sample Test Command: "sites.updateStatus"
interface UpdateSiteStatusInput {
  siteId: string;
  status: "draft" | "active" | "on_hold" | "closing" | "closed";
}

const updateSiteStatusCommand: CommandHandler<UpdateSiteStatusInput, { siteId: string; newStatus: string }> = {
  name: "sites.change_status",
  input: z.object({
    siteId: z.string().uuid(),
    status: z.enum(["draft", "active", "on_hold", "closing", "closed"]),
  }),
  async authorize(ctx, input) {
    assertPermission(ctx.actor.roles, "site.change_status");
    assertSiteInScope(ctx, input.siteId);
  },
  async execute(ctx, input) {
    await ctx.tx
      .update(sites)
      .set({ status: input.status, updatedAt: ctx.now, updatedBy: ctx.actor.userId })
      .where(eq(sites.id, input.siteId));

    return {
      result: { siteId: input.siteId, newStatus: input.status },
      events: [
        {
          orgId: ctx.orgId,
          type: "site.status_changed",
          aggregateType: "site",
          aggregateId: input.siteId,
          payload: { oldStatus: "draft", newStatus: input.status },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

describe("M1 Platform Core Integration Tests", () => {
  let testEnv: Awaited<ReturnType<typeof createTestDb>>;
  const orgId = "10000000-0000-0000-0000-000000000001";
  const siteRiversideId = "20000000-0000-0000-0000-000000000001";
  const siteHighlandId = "20000000-0000-0000-0000-000000000002";
  const adminUserId = "30000000-0000-0000-0000-000000000001";
  const operatorUserId = "30000000-0000-0000-0000-000000000003";

  beforeEach(async () => {
    testEnv = await createTestDb();

    // Insert initial org and sites
    await testEnv.db.insert(organizations).values({
      id: orgId,
      name: "Stoker Test Org",
      currency: "USD",
    });

    await testEnv.db.insert(sites).values([
      {
        id: siteRiversideId,
        orgId,
        code: "RVR-01",
        name: "Riverside Mill",
        status: "draft",
      },
      {
        id: siteHighlandId,
        orgId,
        code: "HLD-02",
        name: "Highland Timber",
        status: "draft",
      },
    ]);
  });

  afterEach(async () => {
    await testEnv.cleanup();
  });

  it("1. Audit row written per command execution inside transaction", async () => {
    const ctx: Omit<CommandContext, "tx"> = {
      actor: {
        userId: adminUserId,
        roles: ["admin"],
        siteIds: [siteRiversideId],
      },
      orgId,
      now: new Date("2026-10-05T01:00:00Z"),
      source: "console",
    };

    const res = await runCommand({
      handler: updateSiteStatusCommand,
      input: { siteId: siteRiversideId, status: "active" },
      ctx,
      db: testEnv.db,
    });

    expect(res).toEqual({ siteId: siteRiversideId, newStatus: "active" });

    // Check audit_log table
    const auditRows = await testEnv.db.select().from(auditLog);
    expect(auditRows).toHaveLength(1);
    expect(auditRows[0]?.action).toBe("sites.change_status");
    expect(auditRows[0]?.actorId).toBe(adminUserId);
    expect(auditRows[0]?.entityType).toBe("site");
    expect(auditRows[0]?.entityId).toBe(siteRiversideId);

    // Check domain_events outbox
    const events = await testEnv.db.select().from(domainEvents);
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe("site.status_changed");
    expect(events[0]?.aggregateId).toBe(siteRiversideId);
  });

  it("2. Idempotent replay: duplicate submission returns cached result without duplicate events or audit rows", async () => {
    const idempotencyKey = generateId();
    const ctx: Omit<CommandContext, "tx"> = {
      actor: {
        userId: adminUserId,
        roles: ["admin"],
        siteIds: [siteRiversideId],
      },
      orgId,
      now: new Date("2026-10-05T01:00:00Z"),
      source: "field",
      idempotencyKey,
    };

    // First attempt
    const firstResult = await runCommand({
      handler: updateSiteStatusCommand,
      input: { siteId: siteRiversideId, status: "active" },
      ctx,
      db: testEnv.db,
    });

    expect(firstResult.newStatus).toBe("active");

    const eventsAfterFirst = await testEnv.db.select().from(domainEvents);
    const auditAfterFirst = await testEnv.db.select().from(auditLog);
    const processedAfterFirst = await testEnv.db.select().from(processedCommands);

    expect(eventsAfterFirst).toHaveLength(1);
    expect(auditAfterFirst).toHaveLength(1);
    expect(processedAfterFirst).toHaveLength(1);
    expect(processedAfterFirst[0]?.id).toBe(idempotencyKey);

    // Replay with identical idempotencyKey
    const secondResult = await runCommand({
      handler: updateSiteStatusCommand,
      input: { siteId: siteRiversideId, status: "active" },
      ctx,
      db: testEnv.db,
    });

    expect(secondResult).toEqual(firstResult);

    // Verify NO duplicate events or audit rows were created
    const eventsAfterSecond = await testEnv.db.select().from(domainEvents);
    const auditAfterSecond = await testEnv.db.select().from(auditLog);
    const processedAfterSecond = await testEnv.db.select().from(processedCommands);

    expect(eventsAfterSecond).toHaveLength(1);
    expect(auditAfterSecond).toHaveLength(1);
    expect(processedAfterSecond).toHaveLength(1);
  });

  it("3. Forbidden actions rejected: unauthorized role throws ForbiddenError and rolls back", async () => {
    const ctx: Omit<CommandContext, "tx"> = {
      actor: {
        userId: operatorUserId,
        roles: ["site_operator"], // site_operator does NOT have "site.change_status"
        siteIds: [siteRiversideId],
      },
      orgId,
      now: new Date("2026-10-05T01:00:00Z"),
      source: "field",
    };

    await expect(
      runCommand({
        handler: updateSiteStatusCommand,
        input: { siteId: siteRiversideId, status: "active" },
        ctx,
        db: testEnv.db,
      })
    ).rejects.toThrow(ForbiddenError);

    // Confirm nothing was committed
    const siteRows = await testEnv.db.select().from(sites).where(eq(sites.id, siteRiversideId));
    expect(siteRows[0]?.status).toBe("draft"); // remains untouched

    const auditRows = await testEnv.db.select().from(auditLog);
    expect(auditRows).toHaveLength(0);

    const eventRows = await testEnv.db.select().from(domainEvents);
    expect(eventRows).toHaveLength(0);
  });

  it("4. Field user cannot touch or see sites outside their assigned scope", async () => {
    // Admin has permissions, but suppose an operator has site.change_status added or supervisor tries Highland
    const supervisorCtx: Omit<CommandContext, "tx"> = {
      actor: {
        userId: "30000000-0000-0000-0000-000000000002",
        roles: ["site_supervisor"],
        siteIds: [siteRiversideId], // Only assigned to Riverside, NOT Highland!
      },
      orgId,
      now: new Date("2026-10-05T01:00:00Z"),
      source: "field",
    };

    // Supervisor tries to touch siteHighlandId
    await expect(
      runCommand({
        handler: updateSiteStatusCommand,
        input: { siteId: siteHighlandId, status: "active" },
        ctx: supervisorCtx,
        db: testEnv.db,
      })
    ).rejects.toThrow(ForbiddenError);

    // Site scoping queries via buildSiteScopeCondition:
    // Supervisor sees only Riverside Mill
    const supervisorCondition = buildSiteScopeCondition(supervisorCtx);
    const supervisorVisibleSites = await testEnv.db.select().from(sites).where(supervisorCondition);
    expect(supervisorVisibleSites).toHaveLength(1);
    expect(supervisorVisibleSites[0]?.id).toBe(siteRiversideId);

    // Admin sees all sites
    const adminCtx = {
      orgId,
      actor: {
        userId: adminUserId,
        roles: ["admin" as const],
        siteIds: [],
      },
    };
    const adminCondition = buildSiteScopeCondition(adminCtx);
    const adminVisibleSites = await testEnv.db.select().from(sites).where(adminCondition);
    expect(adminVisibleSites).toHaveLength(2);
  });

  it("5. Input validation error rejects invalid payloads with RFC 9457 ValidationError", async () => {
    const ctx: Omit<CommandContext, "tx"> = {
      actor: {
        userId: adminUserId,
        roles: ["admin"],
        siteIds: [siteRiversideId],
      },
      orgId,
      now: new Date(),
      source: "console",
    };

    await expect(
      runCommand({
        handler: updateSiteStatusCommand,
        input: { siteId: "not-a-uuid", status: "invalid_status" },
        ctx,
        db: testEnv.db,
      })
    ).rejects.toThrow(ValidationError);
  });
});

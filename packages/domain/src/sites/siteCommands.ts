import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { sites, siteAssignments, boilers, cashFloats } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission, assertSiteInScope } from "../shared/permissions";
import { ConflictError, ValidationError, NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface CreateSiteInput {
  code: string;
  name: string;
  clientName?: string;
  address?: string;
  lat?: number;
  lng?: number;
  geofenceRadiusM?: number;
}

export const createSiteCommand: CommandHandler<CreateSiteInput, { id: string; code: string; name: string }> = {
  name: "sites.create",
  input: z.object({
    code: z.string().min(2).max(20),
    name: z.string().min(2).max(100),
    clientName: z.string().optional(),
    address: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    geofenceRadiusM: z.number().int().positive().default(300),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "site.create");
  },
  async execute(ctx, input) {
    // Check code uniqueness within org
    const existing = await ctx.tx
      .select()
      .from(sites)
      .where(and(eq(sites.orgId, ctx.orgId), eq(sites.code, input.code)))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictError(`Site with code ${input.code} already exists`, "SITE_CODE_EXISTS");
    }

    const siteId = generateId();
    await ctx.tx.insert(sites).values({
      id: siteId,
      orgId: ctx.orgId,
      code: input.code,
      name: input.name,
      clientName: input.clientName,
      address: input.address,
      lat: input.lat,
      lng: input.lng,
      geofenceRadiusM: input.geofenceRadiusM ?? 300,
      status: "draft",
      createdBy: ctx.actor.userId,
    });

    return {
      result: { id: siteId, code: input.code, name: input.name },
      events: [
        {
          orgId: ctx.orgId,
          type: "site.created",
          aggregateType: "site",
          aggregateId: siteId,
          payload: { code: input.code, name: input.name },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface ChangeSiteStatusInput {
  siteId: string;
  targetStatus: "draft" | "active" | "on_hold" | "closing" | "closed";
}

/**
 * Lifecycle guards (PRD §6.1):
 * - A site becomes Active when it has at least one boiler installed/assigned and a supervisor.
 * - A site cannot be Closed while it has an installed boiler, an assigned worker, or an outstanding cash balance.
 */
export const changeSiteStatusCommand: CommandHandler<ChangeSiteStatusInput, { siteId: string; status: string }> = {
  name: "sites.change_status",
  input: z.object({
    siteId: z.string().uuid(),
    targetStatus: z.enum(["draft", "active", "on_hold", "closing", "closed"]),
  }),
  async authorize(ctx, input) {
    assertPermission(ctx.actor.roles, "site.change_status");
    assertSiteInScope(ctx, input.siteId);
  },
  async execute(ctx, input) {
    const siteRows = await ctx.tx
      .select()
      .from(sites)
      .where(and(eq(sites.id, input.siteId), eq(sites.orgId, ctx.orgId)))
      .limit(1);

    const site = siteRows[0];
    if (!site) {
      throw new NotFoundError("Site", input.siteId);
    }

    if (input.targetStatus === "active") {
      // Guard: must have at least one boiler located at site
      const siteBoilers = await ctx.tx
        .select()
        .from(boilers)
        .where(and(eq(boilers.locationKind, "site"), eq(boilers.locationId, input.siteId)))
        .limit(1);

      if (siteBoilers.length === 0) {
        throw new ValidationError("Site cannot become Active without at least one assigned boiler");
      }

      // Guard: must have an assigned supervisor
      const supervisors = await ctx.tx
        .select()
        .from(siteAssignments)
        .where(and(eq(siteAssignments.siteId, input.siteId), eq(siteAssignments.siteRole, "supervisor")))
        .limit(1);

      if (supervisors.length === 0) {
        throw new ValidationError("Site cannot become Active without an assigned supervisor");
      }
    }

    if (input.targetStatus === "closed") {
      // Guard: no installed boilers
      const siteBoilers = await ctx.tx
        .select()
        .from(boilers)
        .where(and(eq(boilers.locationKind, "site"), eq(boilers.locationId, input.siteId)))
        .limit(1);

      if (siteBoilers.length > 0) {
        throw new ValidationError("Site cannot be Closed while boilers are still located on site");
      }

      // Guard: no active floats with status <> 'closed'
      const openFloats = await ctx.tx
        .select()
        .from(cashFloats)
        .where(and(eq(cashFloats.siteId, input.siteId), eq(cashFloats.status, "active")))
        .limit(1);

      if (openFloats.length > 0) {
        throw new ValidationError("Site cannot be Closed while open cash floats remain un-settled");
      }
    }

    await ctx.tx
      .update(sites)
      .set({ status: input.targetStatus, updatedAt: ctx.now, updatedBy: ctx.actor.userId })
      .where(eq(sites.id, input.siteId));

    return {
      result: { siteId: input.siteId, status: input.targetStatus },
      events: [
        {
          orgId: ctx.orgId,
          type: "site.status_changed",
          aggregateType: "site",
          aggregateId: input.siteId,
          payload: { oldStatus: site.status, newStatus: input.targetStatus },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

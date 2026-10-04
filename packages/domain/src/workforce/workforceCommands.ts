import { z } from "zod";
import { eq, and, isNull } from "drizzle-orm";
import { siteAssignments, userSiteScopes } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { ValidationError, NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface AssignEmployeeInput {
  siteId: string;
  employeeId: string;
  siteRole: "supervisor" | "operator" | "helper" | "guard" | "driver";
  startsOn: string;
  endsOn?: string;
  userId?: string;
}

export const assignEmployeeCommand: CommandHandler<AssignEmployeeInput, { assignmentId: string }> = {
  name: "workforce.assign_employee",
  input: z.object({
    siteId: z.string().uuid(),
    employeeId: z.string().uuid(),
    siteRole: z.enum(["supervisor", "operator", "helper", "guard", "driver"]),
    startsOn: z.string(),
    endsOn: z.string().optional(),
    userId: z.string().uuid().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "workforce.assign");
  },
  async execute(ctx, input) {
    // Constraint: one site per employee at a time (PRD §6.1, ARCHITECTURE §7.3)
    const activeAssignments = await ctx.tx
      .select()
      .from(siteAssignments)
      .where(and(eq(siteAssignments.employeeId, input.employeeId), isNull(siteAssignments.endsOn)))
      .limit(1);

    if (activeAssignments.length > 0) {
      throw new ValidationError(
        `Employee ${input.employeeId} already has an active site assignment (one site per employee constraint)`
      );
    }

    const assignmentId = generateId();

    await ctx.tx.insert(siteAssignments).values({
      id: assignmentId,
      siteId: input.siteId,
      employeeId: input.employeeId,
      siteRole: input.siteRole,
      startsOn: input.startsOn,
      endsOn: input.endsOn ?? null,
    });

    // Also update user_site_scopes if user_id linked
    if (input.userId) {
      await ctx.tx
        .insert(userSiteScopes)
        .values({
          userId: input.userId,
          siteId: input.siteId,
        })
        .onConflictDoNothing();
    }

    return {
      result: { assignmentId },
      events: [
        {
          orgId: ctx.orgId,
          type: "workforce.assigned",
          aggregateType: "site_assignment",
          aggregateId: assignmentId,
          payload: {
            siteId: input.siteId,
            employeeId: input.employeeId,
            siteRole: input.siteRole,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface EndAssignmentInput {
  assignmentId: string;
  endsOn: string;
}

export const endAssignmentCommand: CommandHandler<EndAssignmentInput, { assignmentId: string }> = {
  name: "workforce.end_assignment",
  input: z.object({
    assignmentId: z.string().uuid(),
    endsOn: z.string(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "workforce.assign");
  },
  async execute(ctx, input) {
    const rows = await ctx.tx
      .select()
      .from(siteAssignments)
      .where(eq(siteAssignments.id, input.assignmentId))
      .limit(1);

    if (rows.length === 0) {
      throw new NotFoundError("SiteAssignment", input.assignmentId);
    }

    await ctx.tx
      .update(siteAssignments)
      .set({ endsOn: input.endsOn })
      .where(eq(siteAssignments.id, input.assignmentId));

    return {
      result: { assignmentId: input.assignmentId },
      events: [
        {
          orgId: ctx.orgId,
          type: "workforce.unassigned",
          aggregateType: "site_assignment",
          aggregateId: input.assignmentId,
          payload: { endsOn: input.endsOn },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

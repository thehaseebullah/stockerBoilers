import { z } from "zod";
import { eq } from "drizzle-orm";
import { shifts, attendanceRecords, leaveRequests, sites } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission, assertSiteInScope } from "../shared/permissions";
import { NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";
import { calculateDistanceMeters } from "../fuel/fuelCommands";

export interface CreateShiftInput {
  siteId: string;
  name: string;
  startsAt: string;
  endsAt: string;
  requiredOperators?: number;
}

export const createShiftCommand: CommandHandler<
  CreateShiftInput,
  { shiftId: string; name: string }
> = {
  name: "hr.create_shift",
  input: z.object({
    siteId: z.string().uuid(),
    name: z.string().min(2).max(50),
    startsAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time in HH:MM format"),
    endsAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time in HH:MM format"),
    requiredOperators: z.number().int().positive().default(2),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "hr.roster_manage");
  },
  async execute(ctx, input) {
    const shiftId = generateId();
    await ctx.tx.insert(shifts).values({
      id: shiftId,
      orgId: ctx.orgId,
      siteId: input.siteId,
      name: input.name,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      requiredOperators: input.requiredOperators ?? 2,
    });

    return {
      result: { shiftId, name: input.name },
      events: [
        {
          orgId: ctx.orgId,
          type: "hr.shift_created",
          aggregateType: "shift",
          aggregateId: shiftId,
          payload: { siteId: input.siteId, name: input.name },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface RecordAttendanceInput {
  siteId: string;
  employeeId: string;
  shiftId?: string;
  kind: "check_in" | "check_out";
  lat?: number;
  lng?: number;
  selfieUrl?: string;
  verifiedBySupervisorId?: string;
}

export const recordAttendanceCommand: CommandHandler<
  RecordAttendanceInput,
  { attendanceId: string; insideGeofence: boolean; distanceM?: number }
> = {
  name: "hr.record_attendance",
  input: z.object({
    siteId: z.string().uuid(),
    employeeId: z.string().uuid(),
    shiftId: z.string().uuid().optional(),
    kind: z.enum(["check_in", "check_out"]),
    lat: z.number().optional(),
    lng: z.number().optional(),
    selfieUrl: z.string().optional(),
    verifiedBySupervisorId: z.string().uuid().optional(),
  }),
  async authorize(ctx, input) {
    assertPermission(ctx.actor.roles, "hr.check_in");
    assertSiteInScope(ctx, input.siteId);
  },
  async execute(ctx, input) {
    const [site] = await ctx.tx
      .select()
      .from(sites)
      .where(eq(sites.id, input.siteId));

    let distanceM: number | undefined;
    let insideGeofence = true;

    if (site?.lat && site?.lng && input.lat && input.lng) {
      distanceM = calculateDistanceMeters(input.lat, input.lng, site.lat, site.lng);
      insideGeofence = distanceM <= (site.geofenceRadiusM || 300);
    }

    const attendanceId = generateId();
    await ctx.tx.insert(attendanceRecords).values({
      id: attendanceId,
      orgId: ctx.orgId,
      siteId: input.siteId,
      employeeId: input.employeeId,
      shiftId: input.shiftId ?? null,
      kind: input.kind,
      recordedAt: ctx.now,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      distanceFromSiteM: distanceM ?? null,
      insideGeofence,
      selfieUrl: input.selfieUrl ?? null,
      verifiedBySupervisorId: input.verifiedBySupervisorId ?? null,
    });

    return {
      result: { attendanceId, insideGeofence, distanceM },
      events: [
        {
          orgId: ctx.orgId,
          type: input.kind === "check_in" ? "hr.checked_in" : "hr.checked_out",
          aggregateType: "attendance",
          aggregateId: attendanceId,
          payload: {
            siteId: input.siteId,
            employeeId: input.employeeId,
            kind: input.kind,
            insideGeofence,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface SubmitLeaveRequestInput {
  employeeId: string;
  leaveType: "annual" | "sick" | "emergency";
  startsOn: string;
  endsOn: string;
  reason?: string;
}

export const submitLeaveRequestCommand: CommandHandler<
  SubmitLeaveRequestInput,
  { leaveId: string; status: string }
> = {
  name: "hr.submit_leave",
  input: z.object({
    employeeId: z.string().uuid(),
    leaveType: z.enum(["annual", "sick", "emergency"]),
    startsOn: z.string(),
    endsOn: z.string(),
    reason: z.string().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "hr.leave_request");
  },
  async execute(ctx, input) {
    const leaveId = generateId();
    await ctx.tx.insert(leaveRequests).values({
      id: leaveId,
      orgId: ctx.orgId,
      employeeId: input.employeeId,
      leaveType: input.leaveType,
      startsOn: input.startsOn,
      endsOn: input.endsOn,
      reason: input.reason ?? null,
      status: "pending",
    });

    return {
      result: { leaveId, status: "pending" },
      events: [
        {
          orgId: ctx.orgId,
          type: "hr.leave_requested",
          aggregateType: "leave_request",
          aggregateId: leaveId,
          payload: { employeeId: input.employeeId, leaveType: input.leaveType },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface ApproveLeaveRequestInput {
  leaveId: string;
}

export const approveLeaveRequestCommand: CommandHandler<
  ApproveLeaveRequestInput,
  { leaveId: string; status: string }
> = {
  name: "hr.approve_leave",
  input: z.object({
    leaveId: z.string().uuid(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "hr.roster_manage");
  },
  async execute(ctx, input) {
    const [leave] = await ctx.tx
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.id, input.leaveId));

    if (!leave) {
      throw new NotFoundError("LeaveRequest", input.leaveId);
    }

    await ctx.tx
      .update(leaveRequests)
      .set({ status: "approved", approvedBy: ctx.actor.userId })
      .where(eq(leaveRequests.id, input.leaveId));

    return {
      result: { leaveId: input.leaveId, status: "approved" },
      events: [
        {
          orgId: ctx.orgId,
          type: "hr.leave_approved",
          aggregateType: "leave_request",
          aggregateId: input.leaveId,
          payload: { employeeId: leave.employeeId },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

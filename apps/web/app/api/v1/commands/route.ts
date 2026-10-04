import { NextRequest, NextResponse } from "next/server";
import { db } from "@stoker/db";
import { Role } from "@stoker/contracts";
import {
  runCommand,
  CommandHandler,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  submitExpenseCommand,
  recordBoilerReadingCommand,
  recordFuelArrivalCommand,
  transferCashCommand,
  recordAttendanceCommand,
  submitLeaveRequestCommand,
  createSiteCommand,
  changeSiteStatusCommand,
  registerBoilerCommand,
  moveBoilerCommand,
  issueFloatCommand,
  approveExpenseCommand,
  planFuelDeliveryCommand,
  dispatchFuelDeliveryCommand,
  attachDeliveryMediaCommand,
} from "@stoker/domain";

// Registry of domain commands executable via API
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic command handlers
const COMMAND_REGISTRY: Record<string, CommandHandler<any, any>> = {
  "expenses.submit": submitExpenseCommand,
  "expenses.approve": approveExpenseCommand,
  "boilers.record_reading": recordBoilerReadingCommand,
  "boilers.register": registerBoilerCommand,
  "boilers.move": moveBoilerCommand,
  "fuel.plan": planFuelDeliveryCommand,
  "fuel.dispatch": dispatchFuelDeliveryCommand,
  "fuel.record_arrival": recordFuelArrivalCommand,
  "fuel.attach_media": attachDeliveryMediaCommand,
  "cash.issue": issueFloatCommand,
  "cash.transfer": transferCashCommand,
  "sites.create": createSiteCommand,
  "sites.change_status": changeSiteStatusCommand,
  "hr.record_attendance": recordAttendanceCommand,
  "hr.submit_leave": submitLeaveRequestCommand,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, payload, capturedAt, source } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Bad Request",
          status: 400,
          detail: "Command name is required",
        },
        { status: 400 }
      );
    }

    const handler = COMMAND_REGISTRY[name];
    if (!handler) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Not Found",
          status: 404,
          detail: `Unknown command: ${name}`,
        },
        { status: 404 }
      );
    }

    // Extract actor context from headers or defaults (for sandbox / simulator)
    const userId = request.headers.get("x-user-id") || "30000000-0000-0000-0000-000000000001";
    const orgId = request.headers.get("x-org-id") || "10000000-0000-0000-0000-000000000001";
    const rolesHeader = request.headers.get("x-roles");
    const roles: Role[] = rolesHeader ? (rolesHeader.split(",") as Role[]) : (["admin"] as Role[]);
    const siteIdsHeader = request.headers.get("x-site-ids");
    const siteIds = siteIdsHeader ? siteIdsHeader.split(",") : [];

    const ctx = {
      actor: {
        userId,
        roles,
        siteIds,
      },
      orgId,
      now: new Date(),
      capturedAt: capturedAt ? new Date(capturedAt) : undefined,
      idempotencyKey: id,
      source: (source || "field") as "field" | "console" | "simulator",
      traceId: request.headers.get("x-trace-id") || undefined,
    };

    const result = await runCommand({
      handler,
      input: payload,
      ctx,
      db,
    });

    return NextResponse.json({
      status: "success",
      commandId: id,
      result,
    });
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Validation Error",
          status: 400,
          detail: err.message,
          code: err.code,
          fields: err.fields,
        },
        { status: 400 }
      );
    }

    if (err instanceof ForbiddenError) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Forbidden",
          status: 403,
          detail: err.message,
          code: err.code,
        },
        { status: 403 }
      );
    }

    if (err instanceof NotFoundError) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Not Found",
          status: 404,
          detail: err.message,
          code: err.code,
        },
        { status: 404 }
      );
    }

    if (err instanceof ConflictError) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Conflict",
          status: 409,
          detail: err.message,
          code: err.code,
        },
        { status: 409 }
      );
    }

    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Internal Server Error",
        status: 500,
        detail: message,
      },
      { status: 500 }
    );
  }
}

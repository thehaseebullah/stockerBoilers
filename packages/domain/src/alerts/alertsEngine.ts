import { z } from "zod";
import { eq, and } from "drizzle-orm";
import {
  cashFloats,
  cashFloatTxns,
  floatTopUpRequests,
  boilerCertificates,
  fuelDeliveries,
  sites,
  boilers,
} from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface SystemAlert {
  id: string;
  category: "cash" | "fuel" | "maintenance" | "hr";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  entityId?: string;
  createdAt: string;
}

/**
 * Scans all operational vectors to detect actionable anomalies and alerts (M12)
 */
export async function scanSystemAlerts(tx: any, orgId: string): Promise<SystemAlert[]> {
  const alerts: SystemAlert[] = [];

  // 1. Float alerts: Check cash floats below minimum or negative
  const floats = await tx.select().from(cashFloats).where(eq(cashFloats.orgId, orgId));
  for (const f of floats) {
    const txns = await tx.select().from(cashFloatTxns).where(eq(cashFloatTxns.floatId, f.id));
    const currentBalance = txns.reduce((acc: bigint, t: any) => acc + BigInt(t.amountMinor), 0n);

    if (currentBalance < BigInt(f.minBalanceMinor)) {
      alerts.push({
        id: `alert-float-${f.id}`,
        category: "cash",
        severity: "warning",
        title: "Float Balance Below Minimum",
        message: `Float #${f.id.slice(0, 8)} current balance ($${(Number(currentBalance) / 100).toFixed(2)}) is below safety threshold ($${(Number(f.minBalanceMinor) / 100).toFixed(2)}).`,
        entityId: f.id,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // 2. Fuel alerts: Check disputed fuel deliveries
  const disputedDeliveries = await tx
    .select()
    .from(fuelDeliveries)
    .where(and(eq(fuelDeliveries.orgId, orgId), eq(fuelDeliveries.status, "disputed")));

  for (const del of disputedDeliveries) {
    alerts.push({
      id: `alert-fuel-${del.id}`,
      category: "fuel",
      severity: "critical",
      title: `Fuel Shortfall Dispute: ${del.code}`,
      message: `Delivery ${del.code} received ${del.receivedQtyKg ?? 0} kg against ${del.dispatchedQtyKg ?? 0} kg dispatched. Shortfall exceeds tolerance threshold.`,
      entityId: del.id,
      createdAt: new Date().toISOString(),
    });
  }

  // 3. Certificate Expiry Alerts: Check certificates expiring soon (< 30 days)
  const certs = await tx.select().from(boilerCertificates).where(eq(boilerCertificates.orgId, orgId));
  const nowMs = Date.now();
  for (const c of certs) {
    const expiryMs = new Date(c.expiresAt).getTime();
    const daysRemaining = Math.round((expiryMs - nowMs) / (1000 * 60 * 60 * 24));
    if (daysRemaining <= 30) {
      alerts.push({
        id: `alert-cert-${c.id}`,
        category: "maintenance",
        severity: daysRemaining <= 7 ? "critical" : "warning",
        title: `Boiler Certificate Expiry (${c.certificateType})`,
        message: `Certificate #${c.certificateNumber} expires in ${daysRemaining} day(s). Immediate renewal or safety inspection required.`,
        entityId: c.boilerId,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return alerts;
}

export interface RequestFloatTopUpInput {
  floatId: string;
  amountMinor: bigint;
  reason: string;
}

export const requestFloatTopUpCommand: CommandHandler<RequestFloatTopUpInput, { id: string }> = {
  name: "cash.top_up_request",
  input: z.object({
    floatId: z.string().uuid(),
    amountMinor: z.bigint().positive(),
    reason: z.string().min(5),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "cash.top_up_request");
  },
  async execute(ctx, input) {
    const float = await ctx.tx
      .select()
      .from(cashFloats)
      .where(and(eq(cashFloats.orgId, ctx.orgId), eq(cashFloats.id, input.floatId)))
      .limit(1);

    if (float.length === 0 || !float[0]) {
      throw new NotFoundError(`Float ${input.floatId} not found`, "FLOAT_NOT_FOUND");
    }

    const requestId = generateId();
    await ctx.tx.insert(floatTopUpRequests).values({
      id: requestId,
      orgId: ctx.orgId,
      floatId: input.floatId,
      requestedBy: ctx.actor.userId,
      amountMinor: input.amountMinor,
      reason: input.reason,
      status: "pending",
    });

    return {
      result: { id: requestId },
      events: [
        {
          orgId: ctx.orgId,
          type: "cash.top_up_requested",
          aggregateType: "cash_float",
          aggregateId: input.floatId,
          payload: { requestId, amountMinor: input.amountMinor.toString(), reason: input.reason },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface ApproveFloatTopUpInput {
  requestId: string;
}

export const approveFloatTopUpCommand: CommandHandler<ApproveFloatTopUpInput, { id: string; newBalanceMinor: bigint }> = {
  name: "cash.top_up_approve",
  input: z.object({
    requestId: z.string().uuid(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "cash.top_up_approve");
  },
  async execute(ctx, input) {
    const request = await ctx.tx
      .select()
      .from(floatTopUpRequests)
      .where(and(eq(floatTopUpRequests.orgId, ctx.orgId), eq(floatTopUpRequests.id, input.requestId)))
      .limit(1);

    if (request.length === 0 || !request[0]) {
      throw new NotFoundError(`Top-up request ${input.requestId} not found`, "REQUEST_NOT_FOUND");
    }

    const req = request[0];

    await ctx.tx
      .update(floatTopUpRequests)
      .set({
        status: "approved",
        reviewedBy: ctx.actor.userId,
        reviewedAt: ctx.now,
      })
      .where(eq(floatTopUpRequests.id, input.requestId));

    // Post cash float transaction
    await ctx.tx.insert(cashFloatTxns).values({
      id: generateId(),
      floatId: req.floatId,
      kind: "top_up",
      amountMinor: req.amountMinor,
      sourceType: "top_up_request",
      sourceId: req.id,
      occurredAt: ctx.now,
      actorId: ctx.actor.userId,
    });

    // Compute new balance
    const txns = await ctx.tx.select().from(cashFloatTxns).where(eq(cashFloatTxns.floatId, req.floatId));
    const newBalance = txns.reduce((acc: bigint, t: any) => acc + BigInt(t.amountMinor), 0n);

    return {
      result: { id: input.requestId, newBalanceMinor: newBalance },
      events: [
        {
          orgId: ctx.orgId,
          type: "cash.top_up_approved",
          aggregateType: "cash_float",
          aggregateId: req.floatId,
          payload: { requestId: input.requestId, newBalanceMinor: newBalance.toString() },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

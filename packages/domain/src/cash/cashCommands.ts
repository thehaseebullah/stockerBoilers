import { z } from "zod";
import { eq, sum } from "drizzle-orm";
import { cashFloats, cashFloatTxns } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { ValidationError, NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";
import { postJournalEntry } from "../ledger/journal";

/**
 * Non-negotiable 3: Balances are derived.
 * Float balance is always the sum of amount_minor across cash_float_txns.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- reason: allows querying via both db client and transaction
export async function getFloatBalance(tx: any, floatId: string): Promise<bigint> {
  const result = await tx
    .select({ total: sum(cashFloatTxns.amountMinor) })
    .from(cashFloatTxns)
    .where(eq(cashFloatTxns.floatId, floatId));

  const total = result[0]?.total;
  return total ? BigInt(total) : 0n;
}

export interface IssueFloatInput {
  siteId: string;
  custodianId: string;
  accountId: string;
  bankAccountId: string;
  amountMinor: bigint;
  currency?: string;
}

export const issueFloatCommand: CommandHandler<IssueFloatInput, { floatId: string; amountMinor: string }> = {
  name: "cash.issue",
  input: z.object({
    siteId: z.string().uuid(),
    custodianId: z.string().uuid(),
    accountId: z.string().uuid(),
    bankAccountId: z.string().uuid(),
    amountMinor: z.bigint().positive(),
    currency: z.string().default("USD"),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "cash.issue");
  },
  async execute(ctx, input) {
    // 1. Get or create float
    let floatId = generateId();
    const existing = await ctx.tx
      .select()
      .from(cashFloats)
      .where(eq(cashFloats.custodianId, input.custodianId))
      .limit(1);

    if (existing.length > 0 && existing[0]) {
      floatId = existing[0].id;
    } else {
      await ctx.tx.insert(cashFloats).values({
        id: floatId,
        orgId: ctx.orgId,
        siteId: input.siteId,
        custodianId: input.custodianId,
        accountId: input.accountId,
        currency: input.currency,
        status: "active",
      });
    }

    // 2. Insert cash_float_txns (+amountMinor)
    const txnId = generateId();
    await ctx.tx.insert(cashFloatTxns).values({
      id: txnId,
      floatId,
      kind: "issue",
      amountMinor: input.amountMinor,
      sourceType: "cash_float_issue",
      sourceId: txnId,
      occurredAt: ctx.now,
      actorId: ctx.actor.userId,
    });

    // 3. Post double-entry journal: Dr Site float / Cr Bank (ARCHITECTURE §8)
    await postJournalEntry(ctx.tx, {
      orgId: ctx.orgId,
      effectiveDate: ctx.now.toISOString().split("T")[0]!,
      sourceType: "cash_float",
      sourceId: floatId,
      narration: `Issued cash float to custodian ${input.custodianId}`,
      lines: [
        {
          accountId: input.accountId,
          debitMinor: input.amountMinor,
          creditMinor: 0n,
          siteId: input.siteId,
          employeeId: input.custodianId,
        },
        {
          accountId: input.bankAccountId,
          debitMinor: 0n,
          creditMinor: input.amountMinor,
        },
      ],
    });

    return {
      result: { floatId, amountMinor: input.amountMinor.toString() },
      events: [
        {
          orgId: ctx.orgId,
          type: "cash.float_issued",
          aggregateType: "cash_float",
          aggregateId: floatId,
          payload: {
            siteId: input.siteId,
            custodianId: input.custodianId,
            amountMinor: input.amountMinor.toString(),
            currency: input.currency,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface TransferCashInput {
  fromFloatId: string;
  toFloatId: string;
  amountMinor: bigint;
  currency?: string;
}

export const transferCashCommand: CommandHandler<TransferCashInput, { transferId: string }> = {
  name: "cash.transfer",
  input: z.object({
    fromFloatId: z.string().uuid(),
    toFloatId: z.string().uuid(),
    amountMinor: z.bigint().positive(),
    currency: z.string().default("USD"),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "cash.transfer");
  },
  async execute(ctx, input) {
    const fromBalance = await getFloatBalance(ctx.tx, input.fromFloatId);
    if (fromBalance < input.amountMinor) {
      throw new ValidationError(`Insufficient float balance to transfer. Current: ${fromBalance}, Required: ${input.amountMinor}`);
    }

    const transferId = generateId();

    // Deduct from sender
    await ctx.tx.insert(cashFloatTxns).values({
      id: generateId(),
      floatId: input.fromFloatId,
      kind: "transfer_out",
      amountMinor: -input.amountMinor,
      sourceType: "transfer",
      sourceId: transferId,
      occurredAt: ctx.now,
      actorId: ctx.actor.userId,
    });

    // Credit to receiver
    await ctx.tx.insert(cashFloatTxns).values({
      id: generateId(),
      floatId: input.toFloatId,
      kind: "transfer_in",
      amountMinor: input.amountMinor,
      sourceType: "transfer",
      sourceId: transferId,
      occurredAt: ctx.now,
      actorId: ctx.actor.userId,
    });

    const [fromFloat] = await ctx.tx.select().from(cashFloats).where(eq(cashFloats.id, input.fromFloatId));
    const [toFloat] = await ctx.tx.select().from(cashFloats).where(eq(cashFloats.id, input.toFloatId));

    if (!fromFloat || !toFloat) {
      throw new NotFoundError("CashFloat", "sender or receiver");
    }

    // Post balanced journal: Dr Receiving Float / Cr Sending Float
    await postJournalEntry(ctx.tx, {
      orgId: ctx.orgId,
      effectiveDate: ctx.now.toISOString().split("T")[0]!,
      sourceType: "cash_transfer",
      sourceId: transferId,
      narration: `Cash float handover from ${input.fromFloatId} to ${input.toFloatId}`,
      lines: [
        {
          accountId: toFloat.accountId,
          debitMinor: input.amountMinor,
          creditMinor: 0n,
          employeeId: toFloat.custodianId,
        },
        {
          accountId: fromFloat.accountId,
          debitMinor: 0n,
          creditMinor: input.amountMinor,
          employeeId: fromFloat.custodianId,
        },
      ],
    });

    return {
      result: { transferId },
      events: [
        {
          orgId: ctx.orgId,
          type: "cash.transferred",
          aggregateType: "cash_float",
          aggregateId: input.fromFloatId,
          payload: {
            fromFloatId: input.fromFloatId,
            toFloatId: input.toFloatId,
            amountMinor: input.amountMinor.toString(),
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

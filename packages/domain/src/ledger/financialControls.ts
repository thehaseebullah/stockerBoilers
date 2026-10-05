import { z } from "zod";
import { eq, and } from "drizzle-orm";
import {
  accounts,
  journalEntries,
  journalLines,
  financialPeriods,
} from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { ValidationError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface LockPeriodInput {
  periodName: string; // "2026-10"
  startsOn: string;
  endsOn: string;
}

export const lockPeriodCommand: CommandHandler<LockPeriodInput, { id: string; periodName: string }> = {
  name: "ledger.period_lock",
  input: z.object({
    periodName: z.string().regex(/^\d{4}-\d{2}$/, "Must be YYYY-MM format"),
    startsOn: z.string().min(10),
    endsOn: z.string().min(10),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "ledger.period_lock");
  },
  async execute(ctx, input) {
    const existing = await ctx.tx
      .select()
      .from(financialPeriods)
      .where(and(eq(financialPeriods.orgId, ctx.orgId), eq(financialPeriods.periodName, input.periodName)))
      .limit(1);

    let periodId: string;
    if (existing.length > 0 && existing[0]) {
      periodId = existing[0].id;
      await ctx.tx
        .update(financialPeriods)
        .set({
          isLocked: true,
          lockedBy: ctx.actor.userId,
          lockedAt: ctx.now,
        })
        .where(eq(financialPeriods.id, periodId));
    } else {
      periodId = generateId();
      await ctx.tx.insert(financialPeriods).values({
        id: periodId,
        orgId: ctx.orgId,
        periodName: input.periodName,
        startsOn: input.startsOn,
        endsOn: input.endsOn,
        isLocked: true,
        lockedBy: ctx.actor.userId,
        lockedAt: ctx.now,
      });
    }

    return {
      result: { id: periodId, periodName: input.periodName },
      events: [
        {
          orgId: ctx.orgId,
          type: "ledger.period_locked",
          aggregateType: "financial_period",
          aggregateId: periodId,
          payload: { periodName: input.periodName },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface ManualJournalInput {
  effectiveDate: string;
  narration: string;
  lines: Array<{
    accountId: string;
    debitMinor: bigint;
    creditMinor: bigint;
    siteId?: string;
  }>;
}

export const recordManualJournalCommand: CommandHandler<ManualJournalInput, { id: string }> = {
  name: "ledger.manual_entry",
  input: z.object({
    effectiveDate: z.string().min(10),
    narration: z.string().min(5),
    lines: z.array(
      z.object({
        accountId: z.string().uuid(),
        debitMinor: z.bigint().nonnegative(),
        creditMinor: z.bigint().nonnegative(),
        siteId: z.string().uuid().optional(),
      })
    ).min(2),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "ledger.manual_entry");
  },
  async execute(ctx, input) {
    // 1. Verify that debits === credits (Double Entry invariant)
    const sumDebits = input.lines.reduce((acc, l) => acc + l.debitMinor, 0n);
    const sumCredits = input.lines.reduce((acc, l) => acc + l.creditMinor, 0n);

    if (sumDebits !== sumCredits) {
      throw new ValidationError(
        `Journal entry is out of balance: debits (${sumDebits}) != credits (${sumCredits})`,
        { lines: ["UNBALANCED_JOURNAL"] }
      );
    }

    // 2. Check if period is locked
    const month = input.effectiveDate.slice(0, 7);
    const lockedPeriod = await ctx.tx
      .select()
      .from(financialPeriods)
      .where(
        and(
          eq(financialPeriods.orgId, ctx.orgId),
          eq(financialPeriods.periodName, month),
          eq(financialPeriods.isLocked, true)
        )
      )
      .limit(1);

    if (lockedPeriod.length > 0) {
      throw new ValidationError(
        `Financial period ${month} is locked against back-dated postings`,
        { period: ["PERIOD_LOCKED"] }
      );
    }

    const entryId = generateId();
    await ctx.tx.insert(journalEntries).values({
      id: entryId,
      orgId: ctx.orgId,
      effectiveDate: input.effectiveDate,
      sourceType: "manual_journal",
      sourceId: entryId,
      narration: input.narration,
    });

    for (const line of input.lines) {
      await ctx.tx.insert(journalLines).values({
        id: generateId(),
        entryId,
        accountId: line.accountId,
        debitMinor: line.debitMinor,
        creditMinor: line.creditMinor,
        siteId: line.siteId,
      });
    }

    return {
      result: { id: entryId },
      events: [
        {
          orgId: ctx.orgId,
          type: "ledger.journal_posted",
          aggregateType: "journal_entry",
          aggregateId: entryId,
          payload: { narration: input.narration, amountMinor: sumDebits.toString() },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

/**
 * Generates trial balance from all accounts and lines
 */
export async function generateTrialBalance(tx: any, orgId: string) {
  const allAccounts = await tx.select().from(accounts).where(eq(accounts.orgId, orgId));
  const allLines = await tx.select().from(journalLines);

  const report = allAccounts.map((acc: any) => {
    const accLines = allLines.filter((l: any) => l.accountId === acc.id);
    const totalDebit = accLines.reduce((sum: bigint, l: any) => sum + BigInt(l.debitMinor), 0n);
    const totalCredit = accLines.reduce((sum: bigint, l: any) => sum + BigInt(l.creditMinor), 0n);
    return {
      code: acc.code,
      name: acc.name,
      type: acc.type,
      totalDebitMinor: totalDebit,
      totalCreditMinor: totalCredit,
      balanceMinor: totalDebit - totalCredit,
    };
  });

  return report;
}

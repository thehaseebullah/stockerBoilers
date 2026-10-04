import { z } from "zod";
import { eq } from "drizzle-orm";
import { expenses, cashFloats, cashFloatTxns, expenseCategories } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission, assertSiteInScope } from "../shared/permissions";
import { ValidationError, NotFoundError, ForbiddenError } from "../shared/errors";
import { generateId } from "../shared/ids";
import { postJournalEntry } from "../ledger/journal";

export interface SubmitExpenseInput {
  kind: "running" | "personal" | "site";
  siteId: string;
  boilerId?: string;
  employeeId: string;
  categoryId: string;
  amountMinor: bigint;
  currency?: string;
  paymentSource: "float" | "own_pocket" | "company_card";
  floatId?: string;
  spentOn: string;
  description?: string;
}

export const submitExpenseCommand: CommandHandler<SubmitExpenseInput, { expenseId: string }> = {
  name: "expenses.submit",
  input: z.object({
    kind: z.enum(["running", "personal", "site"]),
    siteId: z.string().uuid(),
    boilerId: z.string().uuid().optional(),
    employeeId: z.string().uuid(),
    categoryId: z.string().uuid(),
    amountMinor: z.bigint().positive(),
    currency: z.string().default("USD"),
    paymentSource: z.enum(["float", "own_pocket", "company_card"]),
    floatId: z.string().uuid().optional(),
    spentOn: z.string(),
    description: z.string().optional(),
  }),
  async authorize(ctx, input) {
    assertPermission(ctx.actor.roles, "expense.submit");
    assertSiteInScope(ctx, input.siteId);
  },
  async execute(ctx, input) {
    // Guards from ARCHITECTURE §7.3
    if (input.kind === "running" && !input.boilerId) {
      throw new ValidationError("Running expenses must specify a boilerId");
    }
    if (input.paymentSource === "float" && !input.floatId) {
      throw new ValidationError("Expenses paid from float must specify a floatId");
    }

    const expenseId = generateId();

    await ctx.tx.insert(expenses).values({
      id: expenseId,
      orgId: ctx.orgId,
      kind: input.kind,
      siteId: input.siteId,
      boilerId: input.boilerId ?? null,
      employeeId: input.employeeId,
      categoryId: input.categoryId,
      amountMinor: input.amountMinor,
      currency: input.currency,
      paymentSource: input.paymentSource,
      floatId: input.floatId ?? null,
      spentOn: input.spentOn,
      description: input.description,
      status: "submitted",
      capturedAt: ctx.capturedAt ?? ctx.now,
      receivedAt: ctx.now,
    });

    return {
      result: { expenseId },
      events: [
        {
          orgId: ctx.orgId,
          type: "expense.submitted",
          aggregateType: "expense",
          aggregateId: expenseId,
          payload: {
            siteId: input.siteId,
            employeeId: input.employeeId,
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

export interface ApproveExpenseInput {
  expenseId: string;
}

/**
 * Approval thresholds (PRD §14, ARCHITECTURE §8):
 * - auto-approve < 2,000 minor units
 * - supervisor <= 10,000 minor units
 * - finance above 10,000 minor units
 */
export const approveExpenseCommand: CommandHandler<ApproveExpenseInput, { expenseId: string; status: string }> = {
  name: "expenses.approve",
  input: z.object({
    expenseId: z.string().uuid(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "expense.approve");
  },
  async execute(ctx, input) {
    const [expense] = await ctx.tx
      .select()
      .from(expenses)
      .where(eq(expenses.id, input.expenseId));

    if (!expense) {
      throw new NotFoundError("Expense", input.expenseId);
    }

    assertSiteInScope(ctx, expense.siteId);

    // Enforce approval thresholds
    const isFinanceOrAdmin = ctx.actor.roles.some((r) => r === "admin" || r === "finance");
    const thresholdSupervisorMax = 1000000n; // 10,000.00 in minor units

    if (expense.amountMinor > thresholdSupervisorMax && !isFinanceOrAdmin) {
      throw new ForbiddenError(
        "Expense exceeds supervisor approval threshold (10,000.00). Requires Finance approval.",
        "THRESHOLD_EXCEEDED"
      );
    }

    // 1. Update expense status
    await ctx.tx
      .update(expenses)
      .set({ status: "approved" })
      .where(eq(expenses.id, input.expenseId));

    // 2. If paid from float, deduct from float
    if (expense.paymentSource === "float" && expense.floatId) {
      await ctx.tx.insert(cashFloatTxns).values({
        id: generateId(),
        floatId: expense.floatId,
        kind: "expense",
        amountMinor: -expense.amountMinor,
        sourceType: "expense",
        sourceId: expense.id,
        occurredAt: ctx.now,
        actorId: ctx.actor.userId,
      });
    }

    // 3. Post to double-entry ledger (ARCHITECTURE §8)
    const [category] = await ctx.tx
      .select()
      .from(expenseCategories)
      .where(eq(expenseCategories.id, expense.categoryId));

    if (category) {
      let creditAccountId: string | undefined;

      if (expense.paymentSource === "float" && expense.floatId) {
        const [float] = await ctx.tx.select().from(cashFloats).where(eq(cashFloats.id, expense.floatId));
        creditAccountId = float?.accountId;
      }

      if (creditAccountId) {
        await postJournalEntry(ctx.tx, {
          orgId: ctx.orgId,
          effectiveDate: expense.spentOn,
          sourceType: "expense",
          sourceId: expense.id,
          narration: `Expense approved: ${expense.description ?? "Site expense"}`,
          lines: [
            {
              accountId: category.accountId,
              debitMinor: expense.amountMinor,
              creditMinor: 0n,
              siteId: expense.siteId,
              boilerId: expense.boilerId ?? undefined,
              employeeId: expense.employeeId,
            },
            {
              accountId: creditAccountId,
              debitMinor: 0n,
              creditMinor: expense.amountMinor,
              siteId: expense.siteId,
              employeeId: expense.employeeId,
            },
          ],
        });
      }
    }

    return {
      result: { expenseId: input.expenseId, status: "approved" },
      events: [
        {
          orgId: ctx.orgId,
          type: "expense.approved",
          aggregateType: "expense",
          aggregateId: input.expenseId,
          payload: {
            amountMinor: expense.amountMinor.toString(),
            siteId: expense.siteId,
            employeeId: expense.employeeId,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

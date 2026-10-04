import { journalEntries, journalLines, DbTransaction } from "@stoker/db";
import { ValidationError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface JournalLineInput {
  accountId: string;
  debitMinor: bigint;
  creditMinor: bigint;
  siteId?: string;
  employeeId?: string;
  boilerId?: string;
  vendorId?: string;
}

export interface PostJournalEntryInput {
  orgId: string;
  effectiveDate: string;
  sourceType: string;
  sourceId: string;
  narration?: string;
  reversesId?: string;
  lines: JournalLineInput[];
}

/**
 * Non-negotiable 2: Every journal entry balances.
 * Debits must equal Credits in minor units.
 */
export async function postJournalEntry(
  tx: DbTransaction,
  input: PostJournalEntryInput
): Promise<string> {
  if (input.lines.length < 2) {
    throw new ValidationError("Journal entry must have at least two lines");
  }

  let totalDebit = 0n;
  let totalCredit = 0n;

  for (const line of input.lines) {
    if (line.debitMinor < 0n || line.creditMinor < 0n) {
      throw new ValidationError("Debit and credit amounts must be non-negative");
    }
    if ((line.debitMinor === 0n && line.creditMinor === 0n) || (line.debitMinor > 0n && line.creditMinor > 0n)) {
      throw new ValidationError("Each line must specify either a debit or a credit, not both or neither");
    }
    totalDebit += line.debitMinor;
    totalCredit += line.creditMinor;
  }

  if (totalDebit !== totalCredit) {
    throw new ValidationError(
      `Journal entry is out of balance. Total Debits: ${totalDebit}, Total Credits: ${totalCredit}`
    );
  }

  const entryId = generateId();

  await tx.insert(journalEntries).values({
    id: entryId,
    orgId: input.orgId,
    effectiveDate: input.effectiveDate,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    narration: input.narration,
    reversesId: input.reversesId,
  });

  for (const line of input.lines) {
    await tx.insert(journalLines).values({
      id: generateId(),
      entryId,
      accountId: line.accountId,
      debitMinor: line.debitMinor,
      creditMinor: line.creditMinor,
      siteId: line.siteId,
      employeeId: line.employeeId,
      boilerId: line.boilerId,
      vendorId: line.vendorId,
    });
  }

  return entryId;
}

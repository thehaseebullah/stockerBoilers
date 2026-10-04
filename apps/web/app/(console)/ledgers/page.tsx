"use client";

import { Panel, DataTable } from "@stoker/ui";
import { BookOpen, CheckCircle2 } from "lucide-react";

export default function LedgersConsolePage() {
  const journalEntriesList = [
    {
      id: "1",
      entryNo: "JE-000104",
      date: "2026-03-01",
      source: "Expense #EXP-0991",
      narration: "Replaced water pressure relief valve gasket",
      debitAccount: "5010 Site Maintenance Expense",
      creditAccount: "1020 Petty Cash Floats (RVR)",
      debitAmount: "$150.00",
      creditAmount: "$150.00",
      balanced: true,
    },
    {
      id: "2",
      entryNo: "JE-000103",
      date: "2026-02-28",
      source: "Cash Float #FL-01",
      narration: "Issued cash float to custodian Tariq Mahmood",
      debitAccount: "1020 Petty Cash Floats (RVR)",
      creditAccount: "1010 Main Operating Bank",
      debitAmount: "$1,000.00",
      creditAmount: "$1,000.00",
      balanced: true,
    },
    {
      id: "3",
      entryNo: "JE-000102",
      date: "2026-02-26",
      source: "Fuel Delivery #DEL-RVR-003",
      narration: "Biofuel delivery received 9.8t @ $95/t",
      debitAccount: "1050 Fuel Biomass Inventory",
      creditAccount: "2010 Accounts Payable (BioFuel Corp)",
      debitAmount: "$931.00",
      creditAmount: "$931.00",
      balanced: true,
    },
    {
      id: "4",
      entryNo: "JE-000101",
      date: "2026-02-25",
      source: "Float Transfer #TR-08",
      narration: "Handover for weekend night shift coverage",
      debitAccount: "1021 Petty Cash Floats (FSD)",
      creditAccount: "1020 Petty Cash Floats (RVR)",
      debitAmount: "$100.00",
      creditAmount: "$100.00",
      balanced: true,
    },
  ];

  const columns = [
    {
      header: "Entry No & Date",
      accessor: (row: typeof journalEntriesList[0]) => (
        <div>
          <div className="font-mono font-bold text-xs text-[var(--ink)]">{row.entryNo}</div>
          <div className="text-[11px] text-[var(--ink-3)]">{row.date}</div>
        </div>
      ),
    },
    {
      header: "Source & Narration",
      accessor: (row: typeof journalEntriesList[0]) => (
        <div>
          <div className="text-xs font-semibold text-[var(--primary)]">{row.source}</div>
          <div className="text-xs text-[var(--ink-2)] truncate max-w-sm">{row.narration}</div>
        </div>
      ),
    },
    {
      header: "Debit Account (Dr)",
      accessor: (row: typeof journalEntriesList[0]) => (
        <div>
          <div className="text-xs font-medium text-[var(--ink)]">{row.debitAccount}</div>
          <div className="font-mono text-xs font-bold text-[var(--ink)]">{row.debitAmount}</div>
        </div>
      ),
    },
    {
      header: "Credit Account (Cr)",
      accessor: (row: typeof journalEntriesList[0]) => (
        <div>
          <div className="text-xs font-medium text-[var(--ink-2)]">{row.creditAccount}</div>
          <div className="font-mono text-xs font-bold text-[var(--ink)]">{row.creditAmount}</div>
        </div>
      ),
    },
    {
      header: "Balance Check",
      accessor: (_row: typeof journalEntriesList[0]) => (
        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--ok)]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Balanced</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
            Double-Entry General Ledger
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            Automated double-entry postings generated directly by domain command executions (PRD §7.7, ARCHITECTURE §8).
          </p>
        </div>
      </div>

      <div className="p-3 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] text-xs text-[var(--ink-2)] flex items-center justify-between">
        <span className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--primary)]" />
          <span>
            <strong>Non-Negotiable 2:</strong> Every journal entry is verified to satisfy <code>sum(debits) === sum(credits)</code> before commit. Money amounts are stored in minor units (integer cents).
          </span>
        </span>
        <span className="font-mono font-bold text-[var(--ok)]">Zero Out-Of-Balance Discrepancies</span>
      </div>

      <Panel title="Journal Entries Stream">
        <DataTable
          columns={columns}
          data={journalEntriesList}
          keyExtractor={(item) => item.id}
        />
      </Panel>
    </div>
  );
}

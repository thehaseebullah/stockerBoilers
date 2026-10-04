"use client";

import { useState } from "react";
import { Panel, DataTable, StatusPill } from "@stoker/ui";
import { Check, X, AlertCircle } from "lucide-react";

export default function ExpensesConsolePage() {
  const [expensesList, setExpensesList] = useState([
    {
      id: "70000000-0000-0000-0000-000000000001",
      code: "EXP-0991",
      site: "Riverside Mill",
      boiler: "BLR-TH-4000",
      employee: "Ali Asghar",
      category: "Chemicals & Water",
      amount: "$150.00",
      amountMinor: 15000n,
      source: "Site Float",
      status: "submitted",
      spentOn: "2026-03-01",
      description: "Replaced water pressure relief valve gasket",
      receipt: "gasket_receipt.jpg",
    },
    {
      id: "70000000-0000-0000-0000-000000000002",
      code: "EXP-0992",
      site: "Riverside Mill",
      boiler: "—",
      employee: "Tariq Mahmood",
      category: "Daily Wage Labour",
      amount: "$80.00",
      amountMinor: 8000n,
      source: "Site Float",
      status: "approved",
      spentOn: "2026-03-02",
      description: "2 extra loaders for wet biomass unloading",
      receipt: "labour_slip.jpg",
    },
    {
      id: "70000000-0000-0000-0000-000000000003",
      code: "EXP-0993",
      site: "Faisalabad Weaving Complex",
      boiler: "BLR-2001",
      employee: "Zubair Khan",
      category: "Emergency Repairs",
      amount: "$1,450.00",
      amountMinor: 145000n,
      source: "Site Float",
      status: "submitted",
      spentOn: "2026-03-03",
      description: "Motor rewind for secondary combustion blower",
      receipt: "rewind_tax_invoice.pdf",
    },
  ]);

  const handleApprove = (id: string) => {
    setExpensesList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "approved" } : e))
    );
  };

  const handleReject = (id: string) => {
    setExpensesList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "rejected" } : e))
    );
  };

  const columns = [
    {
      header: "Expense Code & Date",
      accessor: (row: typeof expensesList[0]) => (
        <div>
          <div className="font-mono font-bold text-[var(--ink)]">{row.code}</div>
          <div className="text-xs text-[var(--ink-3)]">{row.spentOn}</div>
        </div>
      ),
    },
    {
      header: "Site & Asset",
      accessor: (row: typeof expensesList[0]) => (
        <div>
          <div className="font-semibold text-xs text-[var(--ink)]">{row.site}</div>
          <div className="text-[11px] text-[var(--ink-3)]">Boiler: {row.boiler}</div>
        </div>
      ),
    },
    {
      header: "Category & Reason",
      accessor: (row: typeof expensesList[0]) => (
        <div>
          <div className="font-medium text-xs text-[var(--primary)]">{row.category}</div>
          <div className="text-xs text-[var(--ink-2)] truncate max-w-xs">{row.description}</div>
        </div>
      ),
    },
    {
      header: "Amount & Source",
      accessor: (row: typeof expensesList[0]) => (
        <div>
          <div className="font-bold font-mono text-sm text-[var(--ink)]">{row.amount}</div>
          <div className="text-[11px] text-[var(--ink-3)]">{row.source} • {row.employee}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: typeof expensesList[0]) => <StatusPill status={row.status} />,
    },
    {
      header: "Actions",
      accessor: (row: typeof expensesList[0]) => (
        <div className="flex items-center gap-1.5">
          {row.status === "submitted" ? (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="p-1.5 rounded bg-[var(--ok-sunk)] text-[var(--ok)] hover:bg-[var(--ok)] hover:text-white transition-colors"
                title="Approve & Post to Ledger"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="p-1.5 rounded bg-[var(--danger-sunk)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white transition-colors"
                title="Reject Expense"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-[var(--ink-3)] italic">Processed</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
            Expense Approvals & Ledger Postings
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            Incoming field expenses from site floats and out-of-pocket claims with double-entry auto-posting.
          </p>
        </div>
      </div>

      <div className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-control)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[var(--ink-2)]">
          <AlertCircle className="w-4 h-4 text-[var(--primary)]" />
          <span>
            <strong>Approval Policy:</strong> Expenses up to $20.00 auto-approve; supervisor approves up to $100.00; Finance approval required above $100.00 (PRD §14).
          </span>
        </div>
      </div>

      <Panel title="Expense Stream">
        <DataTable
          columns={columns}
          data={expensesList}
          keyExtractor={(item) => item.id}
        />
      </Panel>
    </div>
  );
}

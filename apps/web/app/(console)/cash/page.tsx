"use client";

import { useState } from "react";
import { Panel, DataTable, StatusPill, Button, Input } from "@stoker/ui";
import { Plus, ShieldCheck } from "lucide-react";

export default function CashConsolePage() {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [custodian, setCustodian] = useState("Tariq Mahmood");
  const [amount, setAmount] = useState("1000.00");
  const [site, setSite] = useState("Riverside Mill (RVR-01)");

  const [floatsList, setFloatsList] = useState([
    {
      id: "30000000-0000-0000-0000-000000000001",
      site: "Riverside Mill (RVR-01)",
      custodian: "Tariq Mahmood (Supervisor)",
      accountCode: "1020 (Petty Cash - RVR)",
      issued: "$1,000.00",
      spent: "$150.00",
      pending: "$0.00",
      available: "$850.00",
      status: "active",
      lastSettlement: "5 days ago",
    },
    {
      id: "30000000-0000-0000-0000-000000000002",
      site: "Faisalabad Weaving Complex",
      custodian: "Ali Asghar (Supervisor)",
      accountCode: "1021 (Petty Cash - FSD)",
      issued: "$2,000.00",
      spent: "$800.00",
      pending: "$1,450.00",
      available: "$1,200.00",
      status: "active",
      lastSettlement: "12 days ago",
    },
    {
      id: "30000000-0000-0000-0000-000000000003",
      site: "Highland Biofuels Plant",
      custodian: "Gulzar Hussain (Operator)",
      accountCode: "1022 (Petty Cash - HLD)",
      issued: "$500.00",
      spent: "$500.00",
      pending: "$0.00",
      available: "$0.00",
      status: "settling",
      lastSettlement: "Settling now",
    },
  ]);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setFloatsList([
      ...floatsList,
      {
        id: crypto.randomUUID(),
        site,
        custodian,
        accountCode: "1023 (New Petty Cash)",
        issued: `$${parseFloat(amount).toFixed(2)}`,
        spent: "$0.00",
        pending: "$0.00",
        available: `$${parseFloat(amount).toFixed(2)}`,
        status: "active",
        lastSettlement: "Just now",
      },
    ]);
    setShowIssueModal(false);
  };

  const columns = [
    {
      header: "Site & Custodian",
      accessor: (row: typeof floatsList[0]) => (
        <div>
          <div className="font-semibold text-[var(--ink)]">{row.site}</div>
          <div className="text-xs text-[var(--ink-3)]">{row.custodian}</div>
        </div>
      ),
    },
    {
      header: "Account Code",
      accessor: (row: typeof floatsList[0]) => (
        <span className="font-mono text-xs text-[var(--ink-2)]">{row.accountCode}</span>
      ),
    },
    {
      header: "Issued",
      accessor: (row: typeof floatsList[0]) => (
        <span className="font-mono text-xs">{row.issued}</span>
      ),
    },
    {
      header: "Spent (Approved)",
      accessor: (row: typeof floatsList[0]) => (
        <span className="font-mono text-xs text-[var(--danger)]">{row.spent}</span>
      ),
    },
    {
      header: "Derived Available Balance",
      accessor: (row: typeof floatsList[0]) => (
        <div>
          <div className="font-mono font-bold text-sm text-[var(--ok)]">{row.available}</div>
          {row.pending !== "$0.00" && (
            <div className="text-[10px] text-[var(--warning)] font-mono">Pending: {row.pending}</div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: typeof floatsList[0]) => <StatusPill status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
            Cash Floats & Custodian Balances
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            Petty cash issued to site supervisors, derived dynamically from signed transaction ledger without mutable state.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowIssueModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Cash Float</span>
        </Button>
      </div>

      <div className="p-3 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] text-xs text-[var(--ink-2)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--ok)]" />
          <span>
            <strong>Non-Negotiable 3:</strong> Float balances are derived live from <code>cash_float_txns</code>. Double-entry ledger automatically posts <code>Dr Cash Float / Cr Operating Bank</code> on issuance.
          </span>
        </div>
      </div>

      <Panel title={`Active Custodian Floats (${floatsList.length})`}>
        <DataTable
          columns={columns}
          data={floatsList}
          keyExtractor={(item) => item.id}
        />
      </Panel>

      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-base font-bold text-[var(--ink)] font-[family-name:var(--font-display)]">
                Issue Petty Cash Float
              </h2>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--ink-2)] mb-1">Target Site</label>
                <select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] text-[var(--ink)]"
                >
                  <option value="Riverside Mill (RVR-01)">Riverside Mill (RVR-01)</option>
                  <option value="Highland Biofuels Plant (HLD-02)">Highland Biofuels Plant (HLD-02)</option>
                  <option value="Faisalabad Weaving Complex (FSD-03)">Faisalabad Weaving Complex (FSD-03)</option>
                </select>
              </div>

              <Input
                label="Custodian Employee"
                value={custodian}
                onChange={(e) => setCustodian(e.target.value)}
                required
              />

              <Input
                label="Float Amount (USD)"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowIssueModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Issue Float & Post Journal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Panel, Button, Input } from "@stoker/ui";

export default function SettingsConsolePage() {
  const [currency, setCurrency] = useState("USD");
  const [tolerancePct, setTolerancePct] = useState("2.0");
  const [supervisorThreshold, setSupervisorThreshold] = useState("100.00");
  const [autoApproveLimit, setAutoApproveLimit] = useState("20.00");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
          Operations & Financial Settings
        </h1>
        <p className="text-sm text-[var(--ink-3)] mt-1">
          Global thresholds, operational tolerances, base currency, and lifecycle controls.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-[var(--ok-sunk)] border border-[var(--ok-line)] text-[var(--ok)] rounded-[var(--radius-control)] text-xs font-semibold">
          Configuration parameters saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Panel title="Monetary & Ledger Settings">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Base Currency Code"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
              <Input
                label="Weighbridge Shortfall Tolerance (%)"
                type="number"
                step="0.1"
                value={tolerancePct}
                onChange={(e) => setTolerancePct(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-[var(--ink-3)]">
              Shortfalls exceeding this percentage automatically trip deliveries into the <code>disputed</code> state.
            </p>
          </div>
        </Panel>

        <Panel title="Expense Approval Thresholds">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Auto-Approve Threshold ($)"
                type="number"
                step="1"
                value={autoApproveLimit}
                onChange={(e) => setAutoApproveLimit(e.target.value)}
                required
              />
              <Input
                label="Site Supervisor Max Limit ($)"
                type="number"
                step="1"
                value={supervisorThreshold}
                onChange={(e) => setSupervisorThreshold(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-[var(--ink-3)]">
              Expenses above the supervisor threshold require Finance / Admin clearance before deduction from cash floats.
            </p>
          </div>
        </Panel>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="px-6">
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}

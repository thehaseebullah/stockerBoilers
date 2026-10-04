"use client";

import { useState } from "react";
import { Button, Input } from "@stoker/ui";
import { enqueueFieldCommand, drainOutbox } from "@stoker/field-sync";
import { Camera, CheckCircle2 } from "lucide-react";

export default function FieldExpensesPage() {
  const [kind, setKind] = useState<"running" | "site">("running");
  const [amountDollars, setAmountDollars] = useState<string>("35.00");
  const [category, setCategory] = useState<string>("Chemicals");
  const [description, setDescription] = useState<string>("Boiler descaling solution");
  const [paymentSource, setPaymentSource] = useState<"float" | "own_pocket">("float");
  const [hasReceipt, setHasReceipt] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const amountMinor = BigInt(Math.round(parseFloat(amountDollars) * 100));

      await enqueueFieldCommand({
        name: "expenses.submit",
        payload: {
          kind,
          siteId: "20000000-0000-0000-0000-000000000001",
          boilerId: kind === "running" ? "50000000-0000-0000-0000-000000000001" : undefined,
          employeeId: "60000000-0000-0000-0000-000000000001",
          categoryId: "70000000-0000-0000-0000-000000000001",
          amountMinor: amountMinor.toString(),
          currency: "USD",
          paymentSource,
          floatId: paymentSource === "float" ? "30000000-0000-0000-0000-000000000001" : undefined,
          spentOn: new Date().toISOString().split("T")[0],
          description: `${category}: ${description}`,
        },
      });

      await drainOutbox().catch(() => {});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <h1 className="text-lg font-bold text-[var(--ink)] font-[family-name:var(--font-display)]">
          Log Expense
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Queued offline; automatically deducted from float once approved.
        </p>
      </div>

      {submitted && (
        <div className="p-3 bg-[var(--ok-sunk)] border border-[var(--ok-line)] text-[var(--ok)] rounded-[var(--radius-control)] flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Expense queued into outbox & ready to sync!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-4">
        {/* Kind Toggle */}
        <div>
          <label className="block text-xs font-medium text-[var(--ink-2)] mb-1.5">Expense Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setKind("running")}
              className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-control)] border transition-colors ${
                kind === "running"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--surface-sunk)] text-[var(--ink-2)] border-[var(--line)]"
              }`}
            >
              Running (Boiler)
            </button>
            <button
              type="button"
              onClick={() => setKind("site")}
              className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-control)] border transition-colors ${
                kind === "site"
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--surface-sunk)] text-[var(--ink-2)] border-[var(--line)]"
              }`}
            >
              Site / Personal
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Amount (USD)"
          type="number"
          step="0.01"
          value={amountDollars}
          onChange={(e) => setAmountDollars(e.target.value)}
          required
        />

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-medium text-[var(--ink-2)] mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-control)] text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="Chemicals">Chemicals & Water Treatment</option>
            <option value="Spare Parts">Spare Parts & Hardware</option>
            <option value="Repairs">Emergency Minor Repairs</option>
            <option value="Transport">Local Transport & Fuel Top-up</option>
            <option value="Labour">Daily Wage Labour</option>
            <option value="Meals">Meals on Duty</option>
          </select>
        </div>

        {/* Payment Source */}
        <div>
          <label className="block text-xs font-medium text-[var(--ink-2)] mb-1">Payment Source</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentSource("float")}
              className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-control)] border transition-colors ${
                paymentSource === "float"
                  ? "bg-[var(--surface-sunk)] font-semibold text-[var(--ink)] border-[var(--primary)] ring-1 ring-[var(--primary)]"
                  : "bg-[var(--surface)] text-[var(--ink-3)] border-[var(--line)]"
              }`}
            >
              Site Float ($850.00)
            </button>
            <button
              type="button"
              onClick={() => setPaymentSource("own_pocket")}
              className={`py-2 px-3 text-xs font-medium rounded-[var(--radius-control)] border transition-colors ${
                paymentSource === "own_pocket"
                  ? "bg-[var(--surface-sunk)] font-semibold text-[var(--ink)] border-[var(--primary)] ring-1 ring-[var(--primary)]"
                  : "bg-[var(--surface)] text-[var(--ink-3)] border-[var(--line)]"
              }`}
            >
              Own Pocket (Claim)
            </button>
          </div>
        </div>

        {/* Description */}
        <Input
          label="Item / Purpose Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Receipt Photo Mock */}
        <div>
          <label className="block text-xs font-medium text-[var(--ink-2)] mb-1.5">Receipt Proof</label>
          <div
            onClick={() => setHasReceipt(!hasReceipt)}
            className={`border-2 border-dashed rounded-[var(--radius-control)] p-3 text-center cursor-pointer transition-colors ${
              hasReceipt
                ? "border-[var(--ok)] bg-[var(--ok-sunk)]"
                : "border-[var(--line-strong)] bg-[var(--surface-sunk)]"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Camera className={`w-4 h-4 ${hasReceipt ? "text-[var(--ok)]" : "text-[var(--ink-3)]"}`} />
              <span className="text-xs font-medium text-[var(--ink)]">
                {hasReceipt ? "receipt_slip_0991.jpg (Attached)" : "Tap to snap receipt photo"}
              </span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11"
          disabled={submitting}
        >
          {submitting ? "Queuing..." : "Submit Expense to Outbox"}
        </Button>
      </form>
    </div>
  );
}

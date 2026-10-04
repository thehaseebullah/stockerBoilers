"use client";

import { useState } from "react";
import { Gauge as IndustrialGauge, Button, Input } from "@stoker/ui";
import { enqueueFieldCommand, drainOutbox } from "@stoker/field-sync";
import { CheckCircle2 } from "lucide-react";

export default function FieldBoilerPage() {
  const [pressure, setPressure] = useState<number>(8.5);
  const [runningHours, setRunningHours] = useState<string>("136.0");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await enqueueFieldCommand({
        name: "boilers.record_reading",
        payload: {
          boilerId: "50000000-0000-0000-0000-000000000001",
          siteId: "20000000-0000-0000-0000-000000000001",
          runningHours: parseFloat(runningHours),
          steamPressureBar: pressure,
        },
      });

      // Attempt background drain
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
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] text-center">
        <span className="text-xs text-[var(--ink-3)] font-medium">Boiler #BLR-TH-4000</span>
        <h1 className="text-lg font-bold text-[var(--ink)] font-[family-name:var(--font-display)]">
          Live Steam Pressure
        </h1>

        <div className="flex justify-center py-2">
          <IndustrialGauge
            value={pressure}
            min={0}
            max={15}
            unit="bar"
            zones={[
              { min: 0, max: 5, color: "var(--warning)" },
              { min: 5, max: 11, color: "var(--ok)" },
              { min: 11, max: 15, color: "var(--danger)" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--ink-2)] px-4 pt-1">
          <span>0 bar</span>
          <span className="font-semibold text-[var(--ok)]">Normal: 5–11 bar</span>
          <span>15 bar</span>
        </div>
      </div>

      {submitted && (
        <div className="p-3 bg-[var(--ok-sunk)] border border-[var(--ok-line)] text-[var(--ok)] rounded-[var(--radius-control)] flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Reading recorded & queued into local outbox!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-4">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Record Shift Reading</h2>

        <div>
          <label className="block text-xs font-medium text-[var(--ink-2)] mb-1">
            Steam Pressure (bar): <span className="font-bold text-[var(--primary)]">{pressure}</span>
          </label>
          <input
            type="range"
            min={0}
            max={15}
            step={0.1}
            value={pressure}
            onChange={(e) => setPressure(parseFloat(e.target.value))}
            className="w-full accent-[var(--primary)] h-2 bg-[var(--surface-sunk)] rounded-lg cursor-pointer"
          />
        </div>

        <Input
          label="Total Running Hours"
          type="number"
          step="0.1"
          value={runningHours}
          onChange={(e) => setRunningHours(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Submit Reading to Outbox"}
        </Button>
      </form>
    </div>
  );
}

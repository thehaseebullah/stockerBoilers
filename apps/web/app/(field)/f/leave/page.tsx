"use client";

import { useState } from "react";
import { Button, Input } from "@stoker/ui";
import { enqueueFieldCommand, drainOutbox } from "@stoker/field-sync";
import { CheckCircle2 } from "lucide-react";

export default function FieldLeavePage() {
  const [leaveType, setLeaveType] = useState<"annual" | "sick" | "emergency">("annual");
  const [startsOn, setStartsOn] = useState<string>("2026-03-10");
  const [endsOn, setEndsOn] = useState<string>("2026-03-12");
  const [reason, setReason] = useState<string>("Family personal event");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await enqueueFieldCommand({
        name: "hr.submit_leave",
        payload: {
          employeeId: "60000000-0000-0000-0000-000000000001",
          leaveType,
          startsOn,
          endsOn,
          reason,
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
          Leave Application
        </h1>
        <p className="text-xs text-[var(--ink-3)] mt-0.5">
          Requests are sent directly to HR and the site supervisor.
        </p>
      </div>

      {submitted && (
        <div className="p-3 bg-[var(--ok-sunk)] border border-[var(--ok-line)] text-[var(--ok)] rounded-[var(--radius-control)] flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Leave request submitted and queued into outbox!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--ink-2)] mb-1">Leave Category</label>
          <div className="grid grid-cols-3 gap-2">
            {(["annual", "sick", "emergency"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setLeaveType(cat)}
                className={`py-2 text-xs capitalize font-medium rounded-[var(--radius-control)] border transition-colors ${
                  leaveType === cat
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--surface-sunk)] text-[var(--ink-2)] border-[var(--line)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Start Date"
            type="date"
            value={startsOn}
            onChange={(e) => setStartsOn(e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={endsOn}
            onChange={(e) => setEndsOn(e.target.value)}
            required
          />
        </div>

        <Input
          label="Reason / Notes"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Leave Request"}
        </Button>
      </form>
    </div>
  );
}

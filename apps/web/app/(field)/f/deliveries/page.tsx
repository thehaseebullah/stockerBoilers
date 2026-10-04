"use client";

import { useState } from "react";
import { Button, Input } from "@stoker/ui";
import { enqueueFieldCommand, drainOutbox } from "@stoker/field-sync";
import { CheckCircle2, AlertTriangle, Camera, Video, FileText } from "lucide-react";

export default function FieldDeliveriesPage() {
  const [receivedKg, setReceivedKg] = useState<string>("9800");
  const dispatchedKg = 10000;
  const tolerancePct = 2.0;

  const [platePhoto, setPlatePhoto] = useState(true);
  const [loadPhoto, setLoadPhoto] = useState(true);
  const [slipPhoto, setSlipPhoto] = useState(true);
  const [unloadingVideo, setUnloadingVideo] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const receivedNum = parseFloat(receivedKg) || 0;
  const varianceKg = receivedNum - dispatchedKg;
  const variancePct = ((varianceKg / dispatchedKg) * 100).toFixed(1);
  const isDisputed = varianceKg < -(dispatchedKg * tolerancePct) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await enqueueFieldCommand({
        name: "fuel.record_arrival",
        payload: {
          deliveryId: "80000000-0000-0000-0000-000000000001",
          receivedQtyKg: receivedNum,
        },
      });

      await drainOutbox().catch(() => {});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Incoming Delivery Card */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">Incoming Delivery</span>
          <span className="text-xs font-mono text-[var(--ink-3)]">DEL-RVR-004</span>
        </div>
        <div className="text-base font-bold mt-1 text-[var(--ink)]">
          Vehicle LES-9921 (Hino 500)
        </div>
        <div className="text-xs text-[var(--ink-2)] mt-0.5">
          10,000 kg Rice Husk • Dispatched from Central Biofuels
        </div>
      </div>

      {submitted && (
        <div className="p-3 bg-[var(--ok-sunk)] border border-[var(--ok-line)] text-[var(--ok)] rounded-[var(--radius-control)] flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Proof of arrival logged! Syncing to Console...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-4">
        <h2 className="text-sm font-semibold text-[var(--ink)]">Proof of Arrival (POA) Checklist</h2>

        {/* 4 Guided Media Slots */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            onClick={() => setPlatePhoto(!platePhoto)}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
              platePhoto ? "bg-[var(--ok-sunk)] border-[var(--ok)] text-[var(--ok)]" : "bg-[var(--surface-sunk)] border-[var(--line)] text-[var(--ink-3)]"
            }`}
          >
            <Camera className="w-5 h-5 mx-auto mb-1" />
            <div className="font-semibold text-[11px]">1. Vehicle Plate</div>
            <div className="text-[10px]">{platePhoto ? "Captured ✓" : "Tap to snap"}</div>
          </div>

          <div
            onClick={() => setLoadPhoto(!loadPhoto)}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
              loadPhoto ? "bg-[var(--ok-sunk)] border-[var(--ok)] text-[var(--ok)]" : "bg-[var(--surface-sunk)] border-[var(--line)] text-[var(--ink-3)]"
            }`}
          >
            <Camera className="w-5 h-5 mx-auto mb-1" />
            <div className="font-semibold text-[11px]">2. Biofuel Load</div>
            <div className="text-[10px]">{loadPhoto ? "Captured ✓" : "Tap to snap"}</div>
          </div>

          <div
            onClick={() => setSlipPhoto(!slipPhoto)}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
              slipPhoto ? "bg-[var(--ok-sunk)] border-[var(--ok)] text-[var(--ok)]" : "bg-[var(--surface-sunk)] border-[var(--line)] text-[var(--ink-3)]"
            }`}
          >
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="font-semibold text-[11px]">3. Weighbridge Slip</div>
            <div className="text-[10px]">{slipPhoto ? "Captured ✓" : "Tap to snap"}</div>
          </div>

          <div
            onClick={() => setUnloadingVideo(!unloadingVideo)}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
              unloadingVideo ? "bg-[var(--ok-sunk)] border-[var(--ok)] text-[var(--ok)]" : "bg-[var(--surface-sunk)] border-[var(--line)] text-[var(--ink-3)]"
            }`}
          >
            <Video className="w-5 h-5 mx-auto mb-1" />
            <div className="font-semibold text-[11px]">4. Unload Video</div>
            <div className="text-[10px]">{unloadingVideo ? "15s clip ✓" : "Tap to record"}</div>
          </div>
        </div>

        {/* Quantity Reconciliation */}
        <Input
          label="Received Weight (kg)"
          type="number"
          step="1"
          value={receivedKg}
          onChange={(e) => setReceivedKg(e.target.value)}
          required
        />

        {/* Live Variance Callout */}
        <div
          className={`p-3 rounded-[var(--radius-control)] border text-xs ${
            isDisputed
              ? "bg-[var(--danger-sunk)] border-[var(--danger-line)] text-[var(--danger)]"
              : "bg-[var(--surface-sunk)] border-[var(--line)] text-[var(--ink-2)]"
          }`}
        >
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              {isDisputed && <AlertTriangle className="w-4 h-4" />}
              <span>Variance: {varianceKg > 0 ? `+${varianceKg}` : varianceKg} kg ({variancePct}%)</span>
            </span>
            <span>Tolerance: ±{tolerancePct}%</span>
          </div>
          {isDisputed && (
            <p className="mt-1 text-[11px] font-medium leading-relaxed">
              ⚠️ Shortfall exceeds 2% tolerance threshold! This delivery will be automatically flagged as Disputed upon arrival.
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant={isDisputed ? "danger" : "primary"}
          className="w-full h-11"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : isDisputed ? "Confirm Arrival (Disputed)" : "Confirm Fuel Arrival"}
        </Button>
      </form>
    </div>
  );
}

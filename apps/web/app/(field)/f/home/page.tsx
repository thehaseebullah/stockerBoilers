"use client";

import Link from "next/link";
import { Gauge, Receipt, Truck, Banknote, Clock, ArrowRight } from "lucide-react";
import { StatusPill } from "@stoker/ui";

export default function FieldHomePage() {
  return (
    <div className="space-y-4">
      {/* Site Header Card */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--ink-3)] font-medium uppercase tracking-wider">Assigned Site</span>
          <StatusPill status="active" />
        </div>
        <div className="text-xl font-bold mt-1 text-[var(--ink)] font-[family-name:var(--font-display)]">
          Riverside Mill (RVR-01)
        </div>
        <div className="text-xs text-[var(--ink-2)] mt-0.5 flex items-center gap-1.5">
          <span>Industrial Zone East, Plot 14</span>
          <span>•</span>
          <span className="text-[var(--ok)] font-medium">Inside Geofence</span>
        </div>
      </div>

      {/* Quick Status Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs text-[var(--ink-3)] font-medium flex items-center justify-between">
            <span>Float Balance</span>
            <Banknote className="w-3.5 h-3.5 text-[var(--primary)]" />
          </div>
          <div className="text-lg font-bold mt-1 font-[family-name:var(--font-display)] text-[var(--ink)]">
            $850.00
          </div>
          <div className="text-[11px] text-[var(--ink-3)] mt-0.5">Available to spend</div>
        </div>

        <div className="p-3.5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs text-[var(--ink-3)] font-medium flex items-center justify-between">
            <span>Boiler Steam</span>
            <Gauge className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="text-lg font-bold mt-1 font-[family-name:var(--font-display)] text-[var(--ink)]">
            8.2 bar
          </div>
          <div className="text-[11px] text-[var(--ok)] mt-0.5">Optimal range</div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2 pt-1">
        <Link
          href="/f/deliveries"
          className="w-full h-13 bg-[var(--primary)] text-[var(--ink-inverse)] font-medium rounded-[var(--radius-control)] flex items-center justify-between px-4 text-sm shadow-sm active:opacity-90"
        >
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="font-semibold text-sm leading-tight text-white">Record Fuel Arrival</div>
              <div className="text-[11px] text-white/80">Guided photo/video proof</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white/70" />
        </Link>

        <Link
          href="/f/expenses"
          className="w-full h-13 bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--ink)] font-medium rounded-[var(--radius-control)] flex items-center justify-between px-4 text-sm active:bg-[var(--surface-sunk)]"
        >
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-[var(--ink-2)]" />
            <div className="text-left">
              <div className="font-semibold text-sm leading-tight">Log Expense</div>
              <div className="text-[11px] text-[var(--ink-3)]">Snap receipt & categorize</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--ink-3)]" />
        </Link>

        <Link
          href="/f/boiler"
          className="w-full h-13 bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--ink)] font-medium rounded-[var(--radius-control)] flex items-center justify-between px-4 text-sm active:bg-[var(--surface-sunk)]"
        >
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-[var(--accent)]" />
            <div className="text-left">
              <div className="font-semibold text-sm leading-tight">Boiler Shift Reading</div>
              <div className="text-[11px] text-[var(--ink-3)]">Hours, pressure, water level</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--ink-3)]" />
        </Link>
      </div>

      {/* Shift Badge */}
      <div className="p-3 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--ink-3)]" />
          <span className="text-xs text-[var(--ink-2)] font-medium">Day Shift (08:00 – 20:00)</span>
        </div>
        <Link href="/f/attendance" className="text-xs text-[var(--primary)] font-semibold hover:underline">
          View Roster →
        </Link>
      </div>
    </div>
  );
}

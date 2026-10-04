"use client";

import { useState } from "react";
import Link from "next/link";
import { Panel, Gauge, StatusPill, Button } from "@stoker/ui";
import {
  Flame,
  Building2,
  Banknote,
  Truck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
} from "lucide-react";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");

  const recentEvents = [
    {
      id: "1",
      title: "Boiler BLR-TH-4000 Telemetry Logged",
      site: "Riverside Mill (RVR-01)",
      time: "4 mins ago",
      type: "boiler",
      metric: "8.2 bar • 136.5 hrs",
      status: "ok",
    },
    {
      id: "2",
      title: "Fuel Delivery Arrived — Variance Check",
      site: "Riverside Mill (RVR-01)",
      time: "22 mins ago",
      type: "delivery",
      metric: "9,800 kg (-2.0% within tolerance)",
      status: "arrived",
    },
    {
      id: "3",
      title: "Site Maintenance Expense Approved",
      site: "Riverside Mill (RVR-01)",
      time: "1 hour ago",
      type: "expense",
      metric: "$150.00 • Float Deducted",
      status: "approved",
    },
    {
      id: "4",
      title: "Morning Shift Geofenced Check-In",
      site: "Faisalabad Complex",
      time: "2 hours ago",
      type: "workforce",
      metric: "Tariq Mahmood (Verified GPS: 88m)",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Live Operations Control
            </span>
            <span className="text-xs text-[var(--ink-3)] font-mono">Telemetry sync: Realtime</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-[family-name:var(--font-display)] text-[var(--ink)]">
            Command Center
          </h1>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">
            Real-time boiler telemetry, biomass supply logistics, and dual-entry custody floats.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-3">
          {/* Timeframe pill selector */}
          <div className="flex items-center p-1 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-xl text-xs font-semibold">
            {(["24h", "7d", "30d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeframe === t
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                {t === "24h" ? "24 Hours" : t === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>

          <Link href="/simulator">
            <Button size="sm" variant="secondary" className="flex items-center gap-1.5 border border-purple-500/30 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </Button>
          </Link>

          <Link href="/deliveries">
            <Button size="sm" className="flex items-center gap-1.5 shadow-[0_0_15px_-3px_rgba(14,165,233,0.5)]">
              <Truck className="w-3.5 h-3.5" />
              <span>New Dispatch</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Vibrant Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Sites */}
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] hover:border-sky-500/40 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)] font-mono">
              Active Sites
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
              3
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              100% online
            </span>
          </div>
          <div className="mt-2 text-xs text-[var(--ink-3)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Riverside, Faisalabad, Karachi</span>
          </div>
        </div>

        {/* Deployed Boilers */}
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] hover:border-amber-500/40 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)] font-mono">
              Boilers In Operation
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
              5
            </span>
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-0.5">
              <Activity className="w-3 h-3" />
              18.5 TPH Capacity
            </span>
          </div>
          <div className="mt-2 text-xs text-[var(--ink-3)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Avg pressure: 8.4 bar</span>
          </div>
        </div>

        {/* Outstanding Floats */}
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] hover:border-emerald-500/40 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)] font-mono">
              Float Custody (USD)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
              $50,000.00
            </span>
          </div>
          <div className="mt-2 text-xs text-[var(--ink-3)] flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Derived Balance
            </span>
            <span className="font-mono text-[11px] text-[var(--ink-3)]">3 Custodians</span>
          </div>
        </div>

        {/* Biofuel Deliveries */}
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] hover:border-orange-500/40 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)] font-mono">
              Biofuel In-Transit
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
              10.0 T
            </span>
            <span className="text-xs font-semibold text-orange-400 flex items-center gap-0.5">
              1 Active Trip
            </span>
          </div>
          <div className="mt-2 text-xs text-[var(--ink-3)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>Rice husk to Riverside (Hino 500)</span>
          </div>
        </div>
      </div>

      {/* Signature 240° Telemetry Gauges Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h2 className="text-lg font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
              Real-time Industrial Telemetry
            </h2>
          </div>
          <span className="text-xs text-[var(--ink-3)] font-mono">Live 240° Needle Monitors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Panel
            title="Riverside Mill — Steam Pressure"
            description="BLR-TH-4000 live steam header readout"
            action={<StatusPill status="ok" label="8.2 bar (Normal)" />}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <Gauge
                value={8.2}
                min={0}
                max={16}
                unit="bar"
                label="Steam Header"
                zones={[
                  { from: 0, to: 4, color: "var(--warn)" },
                  { from: 4, to: 12, color: "var(--ok)" },
                  { from: 12, to: 16, color: "var(--danger)" },
                ]}
              />
              <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs text-center">
                <div className="p-2 rounded-xl bg-[var(--surface-sunk)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--ink-3)] uppercase font-mono">Running Hrs</div>
                  <div className="text-sm font-bold text-[var(--ink)] font-mono">136.5 hrs</div>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-sunk)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--ink-3)] uppercase font-mono">Water Temp</div>
                  <div className="text-sm font-bold text-sky-400 font-mono">175° C</div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Faisalabad Complex — Biomass Silo"
            description="Rice husk & bio-briquette buffer"
            action={<StatusPill status="ok" label="78% Stocked" />}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <Gauge
                value={78}
                min={0}
                max={100}
                unit="%"
                label="Husk Silo"
                zones={[
                  { from: 0, to: 25, color: "var(--danger)" },
                  { from: 25, to: 55, color: "var(--warn)" },
                  { from: 55, to: 100, color: "var(--fuel)" },
                ]}
              />
              <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs text-center">
                <div className="p-2 rounded-xl bg-[var(--surface-sunk)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--ink-3)] uppercase font-mono">Burn Rate</div>
                  <div className="text-sm font-bold text-amber-400 font-mono">4.2 T/day</div>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-sunk)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--ink-3)] uppercase font-mono">Days Left</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">~6.5 Days</div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Lahore Unit — Float Utilization"
            description="Petty cash custody against limit"
            action={<StatusPill status="warn" label="50% Utilized" />}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <Gauge
                value={50}
                min={0}
                max={100}
                unit="%"
                label="Float Headroom"
                zones={[
                  { from: 0, to: 25, color: "var(--ok)" },
                  { from: 25, to: 75, color: "var(--warn)" },
                  { from: 75, to: 100, color: "var(--danger)" },
                ]}
              />
              <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs text-center">
                <div className="p-2 rounded-xl bg-[var(--surface-sunk)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--ink-3)] uppercase font-mono">Issued</div>
                  <div className="text-sm font-bold text-[var(--ink)] font-mono">$1,000.00</div>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-sunk)] border border-[var(--line)]">
                  <div className="text-[10px] text-[var(--ink-3)] uppercase font-mono">Available</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">$850.00</div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Operational Feed & Live Flow Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Operational Events (2 cols) */}
        <div className="lg:col-span-2">
          <Panel
            title="Live Operations Audit Stream"
            description="Synchronized domain events across field devices and console"
            action={
              <Link href="/ledgers" className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
                <span>View Ledgers</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="divide-y divide-[var(--line)]">
              {recentEvents.map((evt) => (
                <div key={evt.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--surface-sunk)] border border-[var(--line)] flex items-center justify-center shrink-0">
                      {evt.type === "boiler" && <Flame className="w-4 h-4 text-amber-400" />}
                      {evt.type === "delivery" && <Truck className="w-4 h-4 text-orange-400" />}
                      {evt.type === "expense" && <Banknote className="w-4 h-4 text-emerald-400" />}
                      {evt.type === "workforce" && <Clock className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--ink)]">{evt.title}</div>
                      <div className="text-[11px] text-[var(--ink-3)]">
                        {evt.site} • <span className="font-mono text-[var(--ink-2)]">{evt.metric}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusPill status={evt.status} />
                    <span className="text-[11px] text-[var(--ink-3)] font-mono">{evt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Quick Launch & Quick Stats (1 col) */}
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-purple-500/30 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
                Field Simulator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                DUAL PHONE
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-2 font-[family-name:var(--font-display)]">
              Interactive Hardware Frame
            </h3>
            <p className="text-xs text-purple-200/80 mt-1">
              Simulate Supervisor and Operator mobile flows side-by-side with live event trace inspection.
            </p>
            <div className="mt-4">
              <Link href="/simulator">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-[0_0_15px_-3px_rgba(168,85,247,0.5)]">
                  Open Simulator & Scenarios →
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)] font-mono">
              System Invariants & Health
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[var(--surface-sunk)]">
                <span className="text-[var(--ink-2)]">Double-Entry Ledger Balance</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Balanced
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[var(--surface-sunk)]">
                <span className="text-[var(--ink-2)]">Single-Site Assignment Check</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Enforced
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[var(--surface-sunk)]">
                <span className="text-[var(--ink-2)]">Weighbridge Tolerance</span>
                <span className="font-mono font-bold text-amber-400">2.0% Max</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

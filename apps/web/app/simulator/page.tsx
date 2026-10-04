"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Play,
  Wifi,
  WifiOff,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Flame,
  Activity,
  Layers,
} from "lucide-react";

interface FlowStep {
  id: string;
  source: string;
  event: string;
  stage: "device" | "queue" | "api" | "db" | "ledger" | "console";
  status: "ok" | "dispute" | "pending";
  timestamp: string;
  detail: string;
}

export default function SimulatorPage() {
  const [activeScenario, setActiveScenario] = useState("normal_day");
  const [isOnline, setIsOnline] = useState(true);
  const [gpsMode, setGpsMode] = useState<"inside" | "outside">("inside");
  const [phoneView, setPhoneView] = useState<"supervisor" | "operator">("supervisor");

  const [flowEvents, setFlowEvents] = useState<FlowStep[]>([
    {
      id: "ev-1",
      source: "Phone 1 (Supervisor)",
      event: "fuel.record_arrival",
      stage: "console",
      status: "ok",
      timestamp: "10:14:22",
      detail: "DEL-RVR-004: 9,800 kg received (-2.0% within tolerance) • 4 POA media verified",
    },
    {
      id: "ev-2",
      source: "Phone 2 (Operator)",
      event: "expenses.submit",
      stage: "ledger",
      status: "ok",
      timestamp: "10:18:05",
      detail: "EXP-0991: $150.00 posted Dr Maintenance (5010) / Cr Float (1020)",
    },
    {
      id: "ev-3",
      source: "Phone 2 (Operator)",
      event: "boilers.record_reading",
      stage: "console",
      status: "ok",
      timestamp: "10:22:40",
      detail: "BLR-TH-4000: 8.2 bar steam pressure, 136.5 running hours updated",
    },
  ]);

  const runScenario = (scenarioKey: string) => {
    setActiveScenario(scenarioKey);
    const now = new Date().toLocaleTimeString();

    if (scenarioKey === "short_fuel") {
      setFlowEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          source: "Phone 1 (Supervisor)",
          event: "fuel.record_arrival",
          stage: "console",
          status: "dispute",
          timestamp: now,
          detail: "DEL-FSD-001: 9,450 kg received (-5.5% shortfall). Tolerance 2% exceeded -> AUTO-DISPUTED",
        },
        ...prev,
      ]);
    } else if (scenarioKey === "cash_handover") {
      setFlowEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          source: "Phone 1 (Supervisor)",
          event: "cash.transfer",
          stage: "ledger",
          status: "ok",
          timestamp: now,
          detail: "$50.00 handed over from Tariq Mahmood to Ali Asghar (derived float balance updated)",
        },
        ...prev,
      ]);
    } else {
      setFlowEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          source: "Phone 2 (Operator)",
          event: "boilers.record_reading",
          stage: "console",
          status: "ok",
          timestamp: now,
          detail: "BLR-TH-4000: Steam pressure nominal at 8.4 bar • 137.0 running hours",
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--ink)] overflow-hidden">
      {/* Simulator Master Header */}
      <header className="h-16 border-b border-[var(--line)] bg-[var(--surface)] px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl gradient-flame flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,107,0,0.5)] group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight font-[family-name:var(--font-display)] text-[var(--ink)] flex items-center gap-2">
                <span>STOKER SIMULATOR</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono font-bold">
                  STUDIO
                </span>
              </div>
              <div className="text-[10px] text-[var(--ink-3)]">Dual Mobile Viewport & Reactive Flow Engine</div>
            </div>
          </Link>

          {/* Scenario Trigger Bar */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[var(--line)]">
            <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-xl text-xs font-semibold">
              <button
                onClick={() => runScenario("normal_day")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeScenario === "normal_day"
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                1. Normal Day
              </button>
              <button
                onClick={() => runScenario("short_fuel")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeScenario === "short_fuel"
                    ? "bg-rose-500 text-white shadow-xs"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                2. Fuel Dispute (&gt;2%)
              </button>
              <button
                onClick={() => runScenario("cash_handover")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeScenario === "cash_handover"
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                3. Float Transfer
              </button>
            </div>

            <button
              onClick={() => runScenario(activeScenario)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-xl shadow-[0_0_12px_rgba(249,115,22,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Fire Event</span>
            </button>
          </div>
        </div>

        {/* Virtual Hardware Controls */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              isOnline
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px] font-semibold">{isOnline ? "Net: Online" : "Net: Offline"}</span>
          </button>

          <button
            onClick={() => setGpsMode(gpsMode === "inside" ? "outside" : "inside")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--surface-sunk)] text-[var(--ink-2)] hover:border-sky-500/40 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-[11px]">{gpsMode === "inside" ? "GPS: 145m (Valid)" : "GPS: 650m (Breach)"}</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[var(--ink-2)] hover:text-sky-400 pl-3 border-l border-[var(--line)] transition-colors"
          >
            <span>Exit Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Simulator 3-Column Studio Grid */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Col 1: Virtual Mobile Phone Viewport (4 cols) */}
        <div className="col-span-12 md:col-span-4 border-r border-[var(--line)] p-4 flex flex-col items-center bg-[var(--surface-sunk)]/50 overflow-y-auto">
          <div className="w-full max-w-[340px] flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-[var(--ink)] font-mono">FIELD DEVICE FRAME</span>
            </div>
            {/* Role Switcher Pill */}
            <div className="flex items-center p-0.5 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-[11px] font-semibold">
              <button
                onClick={() => setPhoneView("supervisor")}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  phoneView === "supervisor"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                Supervisor
              </button>
              <button
                onClick={() => setPhoneView("operator")}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  phoneView === "operator"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                Operator
              </button>
            </div>
          </div>

          {/* Sleek Mobile Device Frame */}
          <div className="w-full max-w-[340px] h-[640px] border-4 border-slate-800 rounded-3xl overflow-hidden bg-[var(--surface)] shadow-2xl relative flex flex-col ring-1 ring-white/10">
            {/* Dynamic Island Speaker Notch */}
            <div className="h-5 bg-slate-900 flex justify-center items-center shrink-0">
              <div className="w-16 h-1 bg-slate-700 rounded-full"></div>
            </div>
            <iframe
              src={phoneView === "supervisor" ? "/f/home" : "/f/boiler"}
              className="w-full flex-1 border-0"
              title="Stoker Field Virtual Phone"
            />
            {/* Home indicator bar */}
            <div className="h-4 bg-slate-900 flex justify-center items-center shrink-0">
              <div className="w-24 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Col 2: Live Data Flow Engine (4 cols) */}
        <div className="col-span-12 md:col-span-4 border-r border-[var(--line)] p-5 bg-[var(--surface)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Reactive Data Pipeline</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE SSE
            </span>
          </div>

          {/* Visual Pipeline Stage Trace */}
          <div className="p-3 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-2xl mb-4 text-[10px] font-mono flex items-center justify-between text-[var(--ink-3)]">
            <span className="text-purple-400 font-bold">Device</span>
            <span>→</span>
            <span className="text-sky-400 font-bold">Queue</span>
            <span>→</span>
            <span className="text-blue-400 font-bold">API</span>
            <span>→</span>
            <span className="text-indigo-400 font-bold">DB</span>
            <span>→</span>
            <span className="text-amber-400 font-bold">Ledger</span>
            <span>→</span>
            <span className="text-emerald-400 font-bold">Console</span>
          </div>

          {/* Real-time Stream Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {flowEvents.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface-sunk)] hover:border-sky-500/40 text-xs space-y-2 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {item.status === "dispute" ? (
                      <span className="p-1 rounded-lg bg-rose-500/10 text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-mono font-bold text-[var(--ink)]">{item.event}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--ink-3)]">{item.timestamp}</span>
                </div>

                <div className="text-[11px] text-[var(--ink-2)] leading-relaxed bg-[var(--surface)] p-2 rounded-xl border border-[var(--line)]">
                  {item.detail}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[var(--ink-3)] font-mono">
                  <span>{item.source}</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Ledger Balanced
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Live Head Office Console Mirror (4 cols) */}
        <div className="col-span-12 md:col-span-4 p-4 flex flex-col bg-[var(--surface-sunk)]/50 overflow-hidden">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-[var(--ink)] font-mono">CONSOLE MIRROR VIEW</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">AUTO-REFRESH</span>
          </div>

          <div className="w-full flex-1 border border-[var(--line)] rounded-2xl overflow-hidden bg-[var(--surface)] shadow-xl">
            <iframe
              src="/dashboard"
              className="w-full h-full border-0"
              title="Head Office Console View"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Simulator Master Header */}
      <header className="h-14 border-b border-[var(--line)] bg-[var(--surface)] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">ST</span>
            <span className="font-bold text-base font-[family-name:var(--font-display)] text-[var(--ink)]">
              Stoker Simulator & Live Data Flow
            </span>
          </Link>

          <div className="flex items-center gap-2 pl-4 border-l border-[var(--line)]">
            <select
              value={activeScenario}
              onChange={(e) => runScenario(e.target.value)}
              className="h-8 px-2.5 text-xs font-medium bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] text-[var(--ink)]"
            >
              <option value="normal_day">Scenario 1: Normal Operations Day</option>
              <option value="short_fuel">Scenario 2: Short Fuel Delivery (&gt;2% Dispute)</option>
              <option value="cash_handover">Scenario 3: Field Cash Float Handover</option>
            </select>

            <button
              onClick={() => runScenario(activeScenario)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-control)] hover:bg-[var(--primary-hover)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Trigger Event</span>
            </button>
          </div>
        </div>

        {/* Virtual Device Controls */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-control)] border ${
              isOnline
                ? "bg-[var(--ok-sunk)] text-[var(--ok)] border-[var(--ok-line)]"
                : "bg-[var(--danger-sunk)] text-[var(--danger)] border-[var(--danger-line)]"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? "Virtual Net: Online" : "Virtual Net: Offline"}</span>
          </button>

          <button
            onClick={() => setGpsMode(gpsMode === "inside" ? "outside" : "inside")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface-sunk)] text-[var(--ink-2)]"
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>GPS: {gpsMode === "inside" ? "Inside Geofence (145m)" : "Outside Geofence (650m)"}</span>
          </button>

          <Link
            href="/dashboard"
            className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] pl-2 border-l border-[var(--line)]"
          >
            Exit to Console →
          </Link>
        </div>
      </header>

      {/* Simulator 3-Column Studio */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Col 1: Virtual Mobile Phone Frame */}
        <div className="col-span-4 border-r border-[var(--line)] p-4 flex flex-col items-center bg-[var(--surface-sunk)] overflow-y-auto">
          <div className="w-full flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-bold text-[var(--ink)]">Field App Surface</span>
            </div>
            <div className="flex gap-1 text-[11px]">
              <button
                onClick={() => setPhoneView("supervisor")}
                className={`px-2 py-0.5 rounded ${
                  phoneView === "supervisor"
                    ? "bg-[var(--primary)] text-white font-semibold"
                    : "bg-[var(--surface)] text-[var(--ink-3)]"
                }`}
              >
                Supervisor
              </button>
              <button
                onClick={() => setPhoneView("operator")}
                className={`px-2 py-0.5 rounded ${
                  phoneView === "operator"
                    ? "bg-[var(--primary)] text-white font-semibold"
                    : "bg-[var(--surface)] text-[var(--ink-3)]"
                }`}
              >
                Operator
              </button>
            </div>
          </div>

          {/* Physical Phone Frame */}
          <div className="w-full max-w-[360px] h-[640px] border-4 border-stone-800 rounded-3xl overflow-hidden bg-[var(--surface)] shadow-2xl relative flex flex-col">
            <div className="h-4 bg-stone-800 flex justify-center items-center">
              <div className="w-12 h-1 bg-stone-600 rounded-full"></div>
            </div>
            <iframe
              src={phoneView === "supervisor" ? "/f/home" : "/f/boiler"}
              className="w-full flex-1 border-0"
              title="Stoker Field Virtual Phone"
            />
          </div>
        </div>

        {/* Col 2: Live Data Flow Engine */}
        <div className="col-span-4 border-r border-[var(--line)] p-5 bg-[var(--surface)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[var(--accent)]" />
              <span>Live Event Pipeline</span>
            </h2>
            <span className="text-[10px] font-mono text-[var(--ok)] font-bold">REACTIVE FLOW</span>
          </div>

          {/* Stage Diagram */}
          <div className="p-2.5 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] mb-4 text-[10px] font-mono flex items-center justify-between text-[var(--ink-3)]">
            <span className="text-[var(--primary)] font-bold">Device</span>
            <span>→</span>
            <span className="text-[var(--primary)] font-bold">Queue</span>
            <span>→</span>
            <span className="text-[var(--primary)] font-bold">API</span>
            <span>→</span>
            <span className="text-[var(--primary)] font-bold">Postgres</span>
            <span>→</span>
            <span className="text-[var(--primary)] font-bold">Ledger</span>
            <span>→</span>
            <span className="text-[var(--ok)] font-bold">Console</span>
          </div>

          {/* Events Stream */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {flowEvents.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-xs space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {item.status === "dispute" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-[var(--danger)]" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ok)]" />
                    )}
                    <span className="font-mono font-bold text-[var(--ink)]">{item.event}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--ink-3)]">{item.timestamp}</span>
                </div>

                <div className="text-[11px] text-[var(--ink-2)] leading-relaxed">
                  {item.detail}
                </div>

                <div className="pt-1 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--ink-3)]">
                  <span>Source: {item.source}</span>
                  <span className="font-semibold text-[var(--primary)]">Target: Double-Entry Ledger</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Live Head Office Console Iframe */}
        <div className="col-span-4 p-4 flex flex-col bg-[var(--surface-sunk)] overflow-hidden">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-[var(--ink)]">Head Office Console (Live Feed)</span>
            <span className="text-[10px] text-[var(--ok)] font-medium">Real-time sync</span>
          </div>
          <div className="w-full flex-1 border border-[var(--line-strong)] rounded-xl overflow-hidden bg-[var(--surface)] shadow-md">
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

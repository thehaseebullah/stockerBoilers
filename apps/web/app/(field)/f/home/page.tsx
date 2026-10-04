"use client";

import Link from "next/link";
import { Gauge, Receipt, Truck, Banknote, Clock, ArrowRight, MapPin, UserCheck, Flame } from "lucide-react";
import { StatusPill } from "@stoker/ui";

export default function FieldHomePage() {
  return (
    <div className="space-y-4">
      {/* Site Header Card */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[var(--ink-3)] font-mono font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Assigned Location</span>
          </div>
          <StatusPill status="active" label="OPERATIONAL" />
        </div>
        <div className="text-xl font-bold mt-2 text-[var(--ink)] font-[family-name:var(--font-display)]">
          Riverside Mill (RVR-01)
        </div>
        <div className="text-xs text-[var(--ink-2)] mt-1 flex items-center gap-2">
          <span>Plot 14, East Industrial Area</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Within 300m Geofence
          </span>
        </div>
      </div>

      {/* Quick Status Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-[var(--surface)] border border-[var(--line)] hover:border-emerald-500/30 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs text-[var(--ink-3)] font-semibold flex items-center justify-between font-mono">
            <span>Float Balance</span>
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Banknote className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold mt-1 font-[family-name:var(--font-display)] text-emerald-400">
            $850.00
          </div>
          <div className="text-[11px] text-[var(--ink-3)] mt-0.5">Custody: T. Mahmood</div>
        </div>

        <div className="p-3.5 bg-[var(--surface)] border border-[var(--line)] hover:border-amber-500/30 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs text-[var(--ink-3)] font-semibold flex items-center justify-between font-mono">
            <span>Boiler Steam</span>
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold mt-1 font-[family-name:var(--font-display)] text-amber-400">
            8.2 bar
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Optimal Pressure</div>
        </div>
      </div>

      {/* Primary Touch Action Tiles */}
      <div className="space-y-2.5 pt-1">
        <Link
          href="/f/deliveries"
          className="w-full p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-2xl flex items-center justify-between shadow-[0_0_20px_-3px_rgba(249,115,22,0.4)] active:scale-98 transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm leading-tight text-white">Record Fuel Arrival</div>
              <div className="text-[11px] text-white/85">Weighbridge slip & 4-point proof</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/f/boiler"
          className="w-full p-4 bg-[var(--surface)] border border-[var(--line)] hover:border-sky-500/50 rounded-2xl flex items-center justify-between shadow-xs active:bg-[var(--surface-sunk)] transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm leading-tight text-[var(--ink)]">Log Boiler Reading</div>
              <div className="text-[11px] text-[var(--ink-3)]">Pressure, temperature & running hours</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--ink-3)] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/f/expenses"
          className="w-full p-4 bg-[var(--surface)] border border-[var(--line)] hover:border-rose-500/50 rounded-2xl flex items-center justify-between shadow-xs active:bg-[var(--surface-sunk)] transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm leading-tight text-[var(--ink)]">Log Float Expense</div>
              <div className="text-[11px] text-[var(--ink-3)]">Snap camera receipt & categorize</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--ink-3)] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/f/cash"
          className="w-full p-4 bg-[var(--surface)] border border-[var(--line)] hover:border-emerald-500/50 rounded-2xl flex items-center justify-between shadow-xs active:bg-[var(--surface-sunk)] transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm leading-tight text-[var(--ink)]">Cash Float Handover</div>
              <div className="text-[11px] text-[var(--ink-3)]">Transfer float custody to operator</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--ink-3)] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Shift Badge */}
      <div className="p-3.5 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs text-[var(--ink-2)] font-semibold">Day Shift (08:00 – 20:00)</span>
        </div>
        <Link href="/f/attendance" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Roster</span>
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Flame, LayoutDashboard, Smartphone, Layers, ArrowRight, ShieldCheck, Zap, Gauge } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Background glowing mesh / atmospheric lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-flame flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,107,0,0.6)]">
            <Flame className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight font-[family-name:var(--font-display)]">
              STOKER
            </span>
            <span className="ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              OPERATIONS PLATFORM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>All Engines Operational</span>
          </span>
        </div>
      </header>

      {/* Center Hero Section */}
      <div className="max-w-6xl w-full mx-auto my-12 z-10 space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--line)] shadow-xs text-xs font-semibold text-[var(--ink-2)]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Industrial Steam As A Service • Biofuel Supply Logistics</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-[family-name:var(--font-display)] text-[var(--ink)] leading-tight">
            Industrial Operations, <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
              Engineered With Certainty.
            </span>
          </h1>
          <p className="text-base md:text-lg text-[var(--ink-2)] max-w-2xl mx-auto font-normal">
            Three unified surfaces powered by transactional command handlers, derived balances, double-entry ledgers, and offline-first mobile sync.
          </p>
        </div>

        {/* 3 Portal Launchpad Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Surface 1: Console */}
          <Link
            href="/dashboard"
            className="group p-6 bg-[var(--surface)] border border-[var(--line)] hover:border-sky-500/50 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--ink)]">
                  Head Office Console
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-semibold font-mono">WEB</span>
              </div>
              <p className="text-xs text-[var(--ink-2)] mt-2 leading-relaxed">
                Central control for client sites, boiler deployments, delivery proofs, double-entry financial ledgers, and HR shift rosters.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Enter Head Office Console</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Surface 2: Field PWA */}
          <Link
            href="/f/home"
            className="group p-6 bg-[var(--surface)] border border-[var(--line)] hover:border-orange-500/50 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--ink)]">
                  Field Operations PWA
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold font-mono">MOBILE</span>
              </div>
              <p className="text-xs text-[var(--ink-2)] mt-2 leading-relaxed">
                Offline-first touch app for operators: boiler pressure dials, fuel weighbridge proofs, cash handovers, and GPS attendance.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
              <span>Open Field PWA</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Surface 3: Simulator */}
          <Link
            href="/simulator"
            className="group p-6 bg-[var(--surface)] border border-[var(--line)] hover:border-purple-500/50 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--ink)]">
                  Hardware Simulator
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-semibold font-mono">DUAL FRAME</span>
              </div>
              <p className="text-xs text-[var(--ink-2)] mt-2 leading-relaxed">
                Side-by-side virtual phones executing live workflows with real-time reactive event stream inspection across all stages.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Simulator Frame</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Footer Pill Badges */}
      <footer className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--line)] text-xs text-[var(--ink-3)] z-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-[var(--ink-2)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Double-Entry Balanced
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-semibold text-[var(--ink-2)]">
            <Gauge className="w-4 h-4 text-amber-400" />
            Derived Balances
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-semibold text-[var(--ink-2)]">
            <Zap className="w-4 h-4 text-sky-400" />
            Offline-Ready Dexie Sync
          </span>
        </div>

        <div className="font-mono text-[11px]">
          Stoker Engine © 2026 • BioHeat Ops
        </div>
      </footer>
    </main>
  );
}

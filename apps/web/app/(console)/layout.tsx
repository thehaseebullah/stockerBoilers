import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Flame,
  Truck,
  Receipt,
  Banknote,
  Boxes,
  BookOpen,
  Users,
  Smartphone,
  Settings,
} from "lucide-react";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navSections = [
    {
      title: "OPERATIONS",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-sky-400 group-hover:text-sky-300" },
        { href: "/sites", label: "Client Sites", icon: Building2, color: "text-blue-400 group-hover:text-blue-300" },
        { href: "/boilers", label: "Boilers & Readings", icon: Flame, color: "text-amber-400 group-hover:text-amber-300", badge: "4 Active" },
        { href: "/deliveries", label: "Deliveries & Proof", icon: Truck, color: "text-orange-400 group-hover:text-orange-300" },
      ],
    },
    {
      title: "FINANCE & LOGISTICS",
      items: [
        { href: "/expenses", label: "Expenses & Audit", icon: Receipt, color: "text-rose-400 group-hover:text-rose-300" },
        { href: "/cash", label: "Cash Floats", icon: Banknote, color: "text-emerald-400 group-hover:text-emerald-300" },
        { href: "/inventory", label: "Warehouses & Stock", icon: Boxes, color: "text-purple-400 group-hover:text-purple-300" },
        { href: "/ledgers", label: "Double-Entry Ledgers", icon: BookOpen, color: "text-teal-400 group-hover:text-teal-300" },
      ],
    },
    {
      title: "WORKFORCE & TOOLS",
      items: [
        { href: "/hr", label: "Workforce & Shifts", icon: Users, color: "text-indigo-400 group-hover:text-indigo-300" },
        { href: "/simulator", label: "Simulator Surface", icon: Smartphone, color: "text-fuchsia-400 group-hover:text-fuchsia-300", badge: "Dual Frame" },
        { href: "/settings", label: "System Settings", icon: Settings, color: "text-slate-400 group-hover:text-slate-300" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Sidebar shell */}
      <aside className="w-68 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col shrink-0 shadow-lg">
        {/* Brand header */}
        <div className="h-16 border-b border-[var(--line)] flex items-center justify-between px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl gradient-flame flex items-center justify-center text-white shadow-[0_0_16px_rgba(255,107,0,0.5)] group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight font-[family-name:var(--font-display)] text-[var(--ink)] flex items-center gap-1.5">
                <span>STOKER</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-400 font-mono font-semibold">OPS</span>
              </div>
              <div className="text-[10px] text-[var(--ink-3)] font-medium">Boiler & Biofuel Operations</div>
            </div>
          </Link>
          <span className="text-[10px] font-mono font-bold bg-[var(--primary-soft)] text-[var(--primary)] px-2 py-0.5 rounded-full border border-[var(--primary)]/20">
            v1.0
          </span>
        </div>

        {/* Grouped Navigation */}
        <nav className="flex-1 p-3 space-y-5 text-sm font-medium overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-[var(--ink-3)] uppercase font-mono">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--surface-raised)] text-[var(--ink-2)] hover:text-[var(--ink)] transition-all duration-150 group border border-transparent hover:border-[var(--line)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-lg bg-[var(--surface-sunk)] group-hover:bg-[var(--surface)] transition-colors ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--surface-sunk)] text-[var(--ink-2)] border border-[var(--line)]">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--line)] bg-[var(--surface-sunk)]/50 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[var(--ink-2)] text-[11px] font-medium">BioHeat Ops Org</span>
          </div>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SANDBOX
          </span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-6 sticky top-0 z-10 shadow-xs">
          {/* Quick Telemetry Pills */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-sunk)] border border-[var(--line)] text-xs text-[var(--ink-2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-[var(--ink)]">Console</span>
              <span className="text-[var(--ink-3)]">•</span>
              <span>Central Command</span>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>4 Boilers Firing</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Banknote className="w-3 h-3" />
                <span>$50,000 Float Custody</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Truck className="w-3 h-3" />
                <span>1 En-Route</span>
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/simulator"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-[0_0_15px_-3px_rgba(192,38,211,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch Simulator</span>
            </Link>

            <Link
              href="/f/home"
              className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-sunk)] border border-[var(--line)] text-xs font-semibold rounded-xl text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--primary)] transition-colors"
            >
              <span>Field PWA</span>
            </Link>

            <div className="w-8 h-8 rounded-full gradient-cyber flex items-center justify-center text-white text-xs font-bold shadow-xs">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-[var(--bg)]">
          {children}
        </main>
      </div>
    </div>
  );
}

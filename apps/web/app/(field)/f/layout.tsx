"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Flame, Receipt, Truck, Banknote, UserCheck, RefreshCw } from "lucide-react";

export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/f/home", label: "Home", icon: Flame },
    { href: "/f/boiler", label: "Boiler", icon: Gauge },
    { href: "/f/expenses", label: "Expenses", icon: Receipt },
    { href: "/f/deliveries", label: "Fuel", icon: Truck },
    { href: "/f/cash", label: "Cash", icon: Banknote },
    { href: "/f/attendance", label: "Shift", icon: UserCheck },
    { href: "/f/sync", label: "Sync", icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[var(--bg)] flex flex-col border-x border-[var(--line)] shadow-2xl relative">
      {/* Mobile Top App Bar */}
      <header className="h-16 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20">
        <Link href="/f/home" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-flame flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,107,0,0.5)]">
            <Flame className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight font-[family-name:var(--font-display)] text-[var(--ink)]">
              STOKER FIELD
            </div>
            <div className="text-[10px] text-[var(--ink-3)] font-mono font-medium">Site: Riverside (RVR-01)</div>
          </div>
        </Link>

        <Link
          href="/f/sync"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-sunk)] border border-[var(--line)] text-xs font-semibold hover:border-[var(--ok)] transition-colors shadow-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 text-[11px] font-mono">ONLINE</span>
        </Link>
      </header>

      {/* Main Touch Canvas */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Floating Glass Bottom Navigation Dock */}
      <nav className="h-16 border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur-md fixed bottom-0 max-w-md w-full flex items-center justify-around text-xs font-medium z-20 px-2 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/f/home" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? "text-sky-400 font-bold scale-105"
                  : "text-[var(--ink-3)] hover:text-[var(--ink)] hover:scale-105"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all ${isActive ? "bg-sky-500/15 shadow-[0_0_10px_rgba(56,189,248,0.3)]" : ""}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] leading-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

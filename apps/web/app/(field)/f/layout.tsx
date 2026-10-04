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
    <div className="min-h-screen max-w-md mx-auto bg-[var(--bg)] flex flex-col border-x border-[var(--line)] shadow-sm">
      <header className="h-14 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-4 sticky top-0 z-20">
        <Link href="/f/home" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xs">
            ST
          </div>
          <span className="font-semibold text-base font-[family-name:var(--font-display)] text-[var(--ink)]">
            Stoker Field
          </span>
        </Link>
        <Link href="/f/sync" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-sunk)] border border-[var(--line)] text-xs font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse"></span>
          <span className="text-[var(--ink-2)] text-[11px]">Online</span>
        </Link>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {children}
      </main>

      <nav className="h-16 border-t border-[var(--line)] bg-[var(--surface)] fixed bottom-0 max-w-md w-full flex items-center justify-around text-xs font-medium z-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/f/home" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-lg transition-colors ${
                isActive
                  ? "text-[var(--primary)] font-semibold"
                  : "text-[var(--ink-3)] hover:text-[var(--ink)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

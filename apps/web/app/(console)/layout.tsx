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
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/sites", label: "Sites", icon: Building2 },
    { href: "/boilers", label: "Boilers", icon: Flame },
    { href: "/deliveries", label: "Deliveries & Proof", icon: Truck },
    { href: "/expenses", label: "Expenses", icon: Receipt },
    { href: "/cash", label: "Cash Floats", icon: Banknote },
    { href: "/inventory", label: "Inventory & Warehouses", icon: Boxes },
    { href: "/ledgers", label: "Double-Entry Ledgers", icon: BookOpen },
    { href: "/hr", label: "Workforce & Shifts", icon: Users },
    { href: "/simulator", label: "Field Simulator", icon: Smartphone },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Sidebar shell */}
      <aside className="w-64 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col shrink-0">
        <div className="h-14 border-b border-[var(--line)] flex items-center justify-between px-6">
          <Link href="/dashboard" className="font-semibold text-lg tracking-tight font-[family-name:var(--font-display)] text-[var(--primary)] flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">ST</span>
            <span>Stoker</span>
          </Link>
          <span className="text-[10px] font-mono font-bold bg-[var(--primary-soft)] text-[var(--primary)] px-2 py-0.5 rounded">
            v1.0
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 text-sm font-medium overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--surface-sunk)] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
              >
                <Icon className="w-4 h-4 text-[var(--ink-3)]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--line)] text-xs text-[var(--ink-3)] flex items-center justify-between">
          <span>Org: BioHeat Operations</span>
          <span className="font-mono text-[var(--ok)]">SANDBOX</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="font-medium text-sm text-[var(--ink-2)] flex items-center gap-2">
            <span>Console</span>
            <span>•</span>
            <span className="text-[var(--ink)] font-semibold">Head Office</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/simulator"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] font-semibold rounded-[var(--radius-control)] hover:bg-[var(--primary-hover)] hover:text-white transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch Simulator</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-[var(--line)]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--ok)] animate-pulse"></span>
              <span className="text-[var(--ink-2)]">System Operational</span>
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

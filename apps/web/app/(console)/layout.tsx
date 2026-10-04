import Link from "next/link";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Sidebar shell */}
      <aside className="w-64 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col">
        <div className="h-14 border-b border-[var(--line)] flex items-center px-6">
          <Link href="/dashboard" className="font-semibold text-lg tracking-tight font-[family-name:var(--font-display)] text-[var(--primary)]">
            Stoker Console
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link href="/dashboard" className="block px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--primary-soft)] text-[var(--ink)]">
            Dashboard
          </Link>
          <Link href="/expenses" className="block px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--primary-soft)] text-[var(--ink-2)]">
            Expenses
          </Link>
          <Link href="/cash" className="block px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--primary-soft)] text-[var(--ink-2)]">
            Cash Floats
          </Link>
          <Link href="/inventory/items" className="block px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--primary-soft)] text-[var(--ink-2)]">
            Inventory
          </Link>
          <Link href="/ledgers/general" className="block px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--primary-soft)] text-[var(--ink-2)]">
            Ledgers
          </Link>
          <Link href="/hr/employees" className="block px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--primary-soft)] text-[var(--ink-2)]">
            Workforce / HR
          </Link>
          <Link href="/settings" className="block px-3 py-2 rounded-[var(--radius-control)] hover:bg-[var(--primary-soft)] text-[var(--ink-2)]">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-6">
          <div className="font-medium text-sm text-[var(--ink-2)]">Head Office Console</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--ok)]"></span>
            <span className="text-[var(--ink-2)]">Online</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

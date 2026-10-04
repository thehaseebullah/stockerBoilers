export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-[var(--bg)] flex flex-col border-x border-[var(--line)] shadow-sm">
      <header className="h-14 border-b border-[var(--line)] bg-[var(--surface)] flex items-center justify-between px-4 sticky top-0 z-10">
        <span className="font-semibold text-base font-[family-name:var(--font-display)] text-[var(--primary)]">
          Stoker Field
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--ok)]"></span>
          <span className="text-xs text-[var(--ink-2)] font-medium">Ready</span>
        </div>
      </header>
      <main className="flex-1 p-4 pb-20">
        {children}
      </main>
      <nav className="h-16 border-t border-[var(--line)] bg-[var(--surface)] fixed bottom-0 max-w-md w-full flex items-center justify-around text-xs font-medium text-[var(--ink-2)]">
        <div className="flex flex-col items-center gap-1 text-[var(--primary)]">
          <span>Today</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span>Log</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span>Deliveries</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span>Sync</span>
        </div>
      </nav>
    </div>
  );
}

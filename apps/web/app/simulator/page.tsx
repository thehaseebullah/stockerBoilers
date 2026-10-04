export default function SimulatorPage() {
  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Scenario Bar */}
      <header className="h-14 border-b border-[var(--line)] bg-[var(--surface)] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg font-[family-name:var(--font-display)] text-[var(--primary)]">
            Stoker Simulator
          </span>
          <div className="text-sm border border-[var(--line)] px-3 py-1 rounded-[var(--radius-control)] bg-[var(--surface-sunk)]">
            Scenario: Normal Day
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[var(--primary)] text-[var(--ink-inverse)] text-xs font-medium rounded-[var(--radius-control)]">
            Play
          </button>
          <button className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--line)] text-xs font-medium rounded-[var(--radius-control)]">
            Reset sandbox
          </button>
        </div>
      </header>

      {/* Simulator panels */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Phone A */}
        <div className="col-span-3 border-r border-[var(--line)] p-4 flex flex-col items-center bg-[var(--surface-sunk)]">
          <div className="text-xs font-medium text-[var(--ink-2)] mb-2">Phone A — Supervisor</div>
          <div className="w-full flex-1 max-w-[340px] border border-[var(--line-strong)] rounded-2xl overflow-hidden bg-[var(--surface)] shadow-md">
            <iframe src="/f/home" className="w-full h-full border-0" />
          </div>
        </div>

        {/* Data flow panel */}
        <div className="col-span-4 border-r border-[var(--line)] p-6 bg-[var(--surface)] flex flex-col">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink-3)] mb-4">
            Live Data Flow
          </h2>
          <div className="flex-1 border border-dashed border-[var(--line)] rounded-[var(--radius-card)] p-4 flex items-center justify-center text-sm text-[var(--ink-3)]">
            device → queue → API → database → ledger → console
          </div>
        </div>

        {/* Console preview */}
        <div className="col-span-5 p-4 flex flex-col bg-[var(--surface-sunk)]">
          <div className="text-xs font-medium text-[var(--ink-2)] mb-2">Head Office Console (Live)</div>
          <div className="w-full flex-1 border border-[var(--line-strong)] rounded-xl overflow-hidden bg-[var(--surface)] shadow-md">
            <iframe src="/dashboard" className="w-full h-full border-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

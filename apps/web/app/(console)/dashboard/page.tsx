export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
            Operations overview
          </h1>
          <p className="text-sm text-[var(--ink-2)]">
            Current status across active client sites, boilers, and deliveries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Active sites</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)]">0</div>
        </div>
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Deployed boilers</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)]">0</div>
        </div>
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Outstanding floats</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)]">0.00</div>
        </div>
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Pending deliveries</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)]">0</div>
        </div>
      </div>
    </div>
  );
}

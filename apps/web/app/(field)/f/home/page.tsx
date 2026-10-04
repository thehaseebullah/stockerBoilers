export default function FieldHomePage() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <div className="text-xs text-[var(--ink-3)] font-medium">Assigned site</div>
        <div className="text-lg font-semibold mt-1 font-[family-name:var(--font-display)]">
          Riverside Mill
        </div>
        <div className="text-sm text-[var(--ink-2)] mt-0.5">Boiler #BLR-2001 (Active)</div>
      </div>

      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <div className="text-xs text-[var(--ink-3)] font-medium">Current float balance</div>
        <div className="text-2xl font-bold mt-1 font-[family-name:var(--font-display)]">
          50,000.00
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <button className="w-full h-12 bg-[var(--primary)] text-[var(--ink-inverse)] font-medium rounded-[var(--radius-control)] flex items-center justify-center text-sm shadow-sm hover:bg-[var(--primary-hover)]">
          Record fuel arrival
        </button>
        <button className="w-full h-12 bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--ink)] font-medium rounded-[var(--radius-control)] flex items-center justify-center text-sm hover:bg-[var(--surface-sunk)]">
          Log expense
        </button>
      </div>
    </div>
  );
}

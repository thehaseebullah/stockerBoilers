import { Panel, Gauge, StatusPill, Button } from "@stoker/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-display)] text-[var(--ink)]">
            Operations overview
          </h1>
          <p className="text-sm text-[var(--ink-2)]">
            Current status across active client sites, boilers, and deliveries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill label="All Systems Normal" variant="ok" />
          <Button size="sm">New delivery</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Active sites</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)] tabular-nums text-[var(--ink)]">
            3
          </div>
        </div>
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Deployed boilers</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)] tabular-nums text-[var(--ink)]">
            5
          </div>
        </div>
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Outstanding floats (USD)</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)] tabular-nums text-[var(--ink)]">
            50,000.00
          </div>
        </div>
        <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-sm font-medium text-[var(--ink-2)]">Pending deliveries</div>
          <div className="text-3xl font-semibold mt-2 font-[family-name:var(--font-display)] tabular-nums text-[var(--fuel)]">
            1
          </div>
        </div>
      </div>

      {/* Signature Gauges row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Panel title="Riverside Mill — Float Balance" description="Current float pressure against 100k limit">
          <div className="flex justify-center py-4">
            <Gauge
              value={50}
              min={0}
              max={100}
              unit="k USD"
              label="Site Float"
              zones={[
                { from: 0, to: 20, color: "var(--warn)" },
                { from: 20, to: 80, color: "var(--ok)" },
                { from: 80, to: 100, color: "var(--danger)" },
              ]}
            />
          </div>
        </Panel>

        <Panel title="Highland Timber — Biomass Stock" description="Estimated days remaining at current burn rate">
          <div className="flex justify-center py-4">
            <Gauge
              value={78}
              min={0}
              max={100}
              unit="%"
              label="Husk Stock"
              zones={[
                { from: 0, to: 25, color: "var(--danger)" },
                { from: 25, to: 60, color: "var(--warn)" },
                { from: 60, to: 100, color: "var(--fuel)" },
              ]}
            />
          </div>
        </Panel>

        <Panel title="Valley Processing — Boiler Pressure" description="Operating steam pressure for BLR-2001">
          <div className="flex justify-center py-4">
            <Gauge
              value={12.4}
              min={0}
              max={20}
              unit="bar"
              label="Steam Pressure"
              zones={[
                { from: 0, to: 8, color: "var(--warn)" },
                { from: 8, to: 16, color: "var(--ok)" },
                { from: 16, to: 20, color: "var(--danger)" },
              ]}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}

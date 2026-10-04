"use client";

import { useState } from "react";
import { Panel, DataTable, StatusPill, Button } from "@stoker/ui";
import { AlertTriangle, Image as ImageIcon, Video } from "lucide-react";

interface DeliveryItem {
  id: string;
  code: string;
  site: string;
  vehicle: string;
  driver: string;
  fuel: string;
  dispatchedKg: string;
  receivedKg: string;
  variance: string;
  status: string;
  geofence: string;
  mediaCount: string;
}

export default function DeliveriesConsolePage() {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);

  const deliveriesList = [
    {
      id: "80000000-0000-0000-0000-000000000001",
      code: "DEL-RVR-004",
      site: "Riverside Mill (RVR-01)",
      vehicle: "LES-9921 (Hino 500)",
      driver: "Rasheed Ahmed",
      fuel: "Rice Husk",
      dispatchedKg: "10,000 kg",
      receivedKg: "9,800 kg",
      variance: "-200 kg (-2.0%)",
      status: "arrived",
      geofence: "Inside (145m)",
      mediaCount: "4 proofs (Plate, Load, Slip, Video)",
    },
    {
      id: "80000000-0000-0000-0000-000000000002",
      code: "DEL-FSD-001",
      site: "Faisalabad Weaving Complex",
      vehicle: "FD-4410 (Bedford)",
      driver: "Gulzar Hussain",
      fuel: "Bio-briquettes",
      dispatchedKg: "10,000 kg",
      receivedKg: "9,450 kg",
      variance: "-550 kg (-5.5%)",
      status: "disputed",
      geofence: "Inside (88m)",
      mediaCount: "3 proofs (Plate, Load, Slip)",
    },
    {
      id: "80000000-0000-0000-0000-000000000003",
      code: "DEL-HLD-002",
      site: "Highland Biofuels Plant",
      vehicle: "LES-9921 (Hino 500)",
      driver: "Rasheed Ahmed",
      fuel: "Wood Chips",
      dispatchedKg: "12,000 kg",
      receivedKg: "—",
      variance: "In transit",
      status: "dispatched",
      geofence: "ETA 14:30",
      mediaCount: "1 proof (Loading slip)",
    },
  ];

  const columns = [
    {
      header: "Delivery Code & Site",
      accessor: (row: typeof deliveriesList[0]) => (
        <div>
          <div className="font-bold font-mono text-[var(--ink)]">{row.code}</div>
          <div className="text-xs text-[var(--ink-3)]">{row.site}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: typeof deliveriesList[0]) => (
        <div className="space-y-1">
          <StatusPill status={row.status} />
          {row.status === "disputed" && (
            <div className="text-[10px] text-[var(--danger)] font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Tolerance Exceeded</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Vehicle & Driver",
      accessor: (row: typeof deliveriesList[0]) => (
        <div>
          <div className="text-xs font-semibold text-[var(--ink)]">{row.vehicle}</div>
          <div className="text-[11px] text-[var(--ink-3)]">{row.driver} • {row.fuel}</div>
        </div>
      ),
    },
    {
      header: "Reconciliation",
      accessor: (row: typeof deliveriesList[0]) => (
        <div className="font-mono text-xs">
          <div>Disp: {row.dispatchedKg}</div>
          <div>Recv: <span className="font-bold text-[var(--ink)]">{row.receivedKg}</span></div>
          <div className={row.variance.includes("-5.5") ? "text-[var(--danger)] font-bold" : "text-[var(--ink-3)]"}>
            {row.variance}
          </div>
        </div>
      ),
    },
    {
      header: "Tamper Proof",
      accessor: (row: typeof deliveriesList[0]) => (
        <button
          onClick={() => setSelectedDelivery(row)}
          className="text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{row.mediaCount}</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
            Fuel Logistics & Proof of Arrival
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            Truck dispatches, automated weighbridge shortfall dispute trigger (&gt;2% threshold), and GPS geofence media proof.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs font-medium text-[var(--ink-3)]">Deliveries Today</div>
          <div className="text-2xl font-bold mt-1 text-[var(--ink)] font-[family-name:var(--font-display)]">
            3 Dispatches
          </div>
          <div className="text-xs text-[var(--ok)] mt-1 font-medium">32,000 kg total biomass</div>
        </div>

        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs font-medium text-[var(--ink-3)]">Disputed Shortfalls</div>
          <div className="text-2xl font-bold mt-1 text-[var(--danger)] font-[family-name:var(--font-display)]">
            1 Delivery Flagged
          </div>
          <div className="text-xs text-[var(--danger)] mt-1 font-medium">FD-4410: -550 kg discrepancy</div>
        </div>

        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs font-medium text-[var(--ink-3)]">Geofence Compliance</div>
          <div className="text-2xl font-bold mt-1 text-[var(--ok)] font-[family-name:var(--font-display)]">
            100% On-Site
          </div>
          <div className="text-xs text-[var(--ink-3)] mt-1">All proofs captured within radius</div>
        </div>
      </div>

      <Panel title="Active Deliveries">
        <DataTable
          columns={columns}
          data={deliveriesList}
          keyExtractor={(item) => item.id}
        />
      </Panel>

      {/* Proof Viewer Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h2 className="text-base font-bold text-[var(--ink)] font-[family-name:var(--font-display)]">
                  Proof of Arrival: {selectedDelivery.code}
                </h2>
                <div className="text-xs text-[var(--ink-3)]">
                  {selectedDelivery.site} • Vehicle {selectedDelivery.vehicle}
                </div>
              </div>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border border-[var(--line)] rounded-lg p-3 bg-[var(--surface-sunk)] space-y-2">
                <div className="font-semibold text-[var(--ink)] flex items-center justify-between">
                  <span>1. Vehicle License Plate</span>
                  <span className="text-[10px] text-[var(--ok)] font-bold">SHA-256 ✓</span>
                </div>
                <div className="h-32 bg-[var(--surface)] rounded flex items-center justify-center text-[var(--ink-3)] border border-dashed border-[var(--line)]">
                  [ Photo: Truck Plate LES-9921 ]
                </div>
                <div className="text-[10px] text-[var(--ink-3)]">
                  GPS: 31.5204° N, 74.3587° E • Distance: 145m from site center
                </div>
              </div>

              <div className="border border-[var(--line)] rounded-lg p-3 bg-[var(--surface-sunk)] space-y-2">
                <div className="font-semibold text-[var(--ink)] flex items-center justify-between">
                  <span>2. Loaded Biomass</span>
                  <span className="text-[10px] text-[var(--ok)] font-bold">SHA-256 ✓</span>
                </div>
                <div className="h-32 bg-[var(--surface)] rounded flex items-center justify-center text-[var(--ink-3)] border border-dashed border-[var(--line)]">
                  [ Photo: Rice Husk Cargo ]
                </div>
                <div className="text-[10px] text-[var(--ink-3)]">
                  Condition: Clean, moisture standard (&lt;10%)
                </div>
              </div>

              <div className="border border-[var(--line)] rounded-lg p-3 bg-[var(--surface-sunk)] space-y-2">
                <div className="font-semibold text-[var(--ink)] flex items-center justify-between">
                  <span>3. Weighbridge Slip</span>
                  <span className="text-[10px] text-[var(--ok)] font-bold">SHA-256 ✓</span>
                </div>
                <div className="h-32 bg-[var(--surface)] rounded flex items-center justify-center text-[var(--ink-3)] border border-dashed border-[var(--line)]">
                  [ Gross: 18,200 kg / Tare: 8,400 kg ]
                </div>
                <div className="text-[10px] text-[var(--ink-3)]">
                  Stamped net: 9,800 kg
                </div>
              </div>

              <div className="border border-[var(--line)] rounded-lg p-3 bg-[var(--surface-sunk)] space-y-2">
                <div className="font-semibold text-[var(--ink)] flex items-center justify-between">
                  <span>4. Unloading Video (15s)</span>
                  <span className="text-[10px] text-[var(--ok)] font-bold">SHA-256 ✓</span>
                </div>
                <div className="h-32 bg-[var(--surface)] rounded flex items-center justify-center text-[var(--ink-3)] border border-dashed border-[var(--line)]">
                  <Video className="w-8 h-8 text-[var(--ink-3)]" />
                </div>
                <div className="text-[10px] text-[var(--ink-3)]">
                  Recorded on device camera at Plot 14 hopper
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--line)]">
              <Button variant="secondary" onClick={() => setSelectedDelivery(null)}>
                Close Proof Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

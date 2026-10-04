"use client";

import { useState } from "react";
import { Panel, DataTable, StatusPill, Button, Input } from "@stoker/ui";
import { Plus } from "lucide-react";

export default function BoilersConsolePage() {
  const [boilersList, setBoilersList] = useState([
    {
      id: "50000000-0000-0000-0000-000000000001",
      serialNo: "BLR-TH-4000",
      makeModel: "Thermax Combipac 4T",
      capacity: "4.0 TPH steam",
      state: "installed",
      location: "Riverside Mill (Site)",
      runningHours: "136.5 hrs",
      steamPressure: "8.2 bar",
      fuel: "Rice husk, Sawdust",
    },
    {
      id: "50000000-0000-0000-0000-000000000002",
      serialNo: "BLR-KP-2001",
      makeModel: "Thermax Pac 2T",
      capacity: "2.0 TPH steam",
      state: "in_warehouse",
      location: "Central Warehouse #1",
      runningHours: "820.0 hrs",
      steamPressure: "—",
      fuel: "Rice husk",
    },
    {
      id: "50000000-0000-0000-0000-000000000003",
      serialNo: "BLR-CH-6000",
      makeModel: "Forbes Vyncke Biomass 6T",
      capacity: "6.0 TPH steam",
      state: "in_transit",
      location: "Flatbed Truck (LES-9921)",
      runningHours: "45.0 hrs",
      steamPressure: "—",
      fuel: "Wood chips, Pellets",
    },
  ]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [serialNo, setSerialNo] = useState("BLR-TX-3000");
  const [make, setMake] = useState("Thermax");
  const [model, setModel] = useState("Combipac 3T");
  const [capacity, setCapacity] = useState("3.0");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setBoilersList([
      ...boilersList,
      {
        id: crypto.randomUUID(),
        serialNo,
        makeModel: `${make} ${model}`,
        capacity: `${capacity} TPH steam`,
        state: "in_warehouse",
        location: "Central Warehouse #1",
        runningHours: "0.0 hrs",
        steamPressure: "—",
        fuel: "Rice husk",
      },
    ]);
    setShowRegisterModal(false);
  };

  const columns = [
    {
      header: "Asset Serial & Model",
      accessor: (row: typeof boilersList[0]) => (
        <div>
          <div className="font-bold text-[var(--ink)] font-mono">{row.serialNo}</div>
          <div className="text-xs text-[var(--ink-3)]">{row.makeModel}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: typeof boilersList[0]) => <StatusPill status={row.state} />,
    },
    {
      header: "Current Location",
      accessor: (row: typeof boilersList[0]) => (
        <span className="text-xs font-medium text-[var(--ink)]">{row.location}</span>
      ),
    },
    {
      header: "Running Log",
      accessor: (row: typeof boilersList[0]) => (
        <div>
          <div className="text-xs font-semibold text-[var(--ink)]">{row.runningHours}</div>
          <div className="text-[11px] text-[var(--ink-3)]">Pressure: {row.steamPressure}</div>
        </div>
      ),
    },
    {
      header: "Fuel Compatibility",
      accessor: (row: typeof boilersList[0]) => (
        <span className="text-xs text-[var(--ink-2)]">{row.fuel}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
            Boiler Asset Registry
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            Rentable industrial assets, movement ledger across warehouses/sites, and cumulative shift readings.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Boiler</span>
        </Button>
      </div>

      <Panel title={`Registered Boilers (${boilersList.length})`}>
        <DataTable
          columns={columns}
          data={boilersList}
          keyExtractor={(item) => item.id}
        />
      </Panel>

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-base font-bold text-[var(--ink)] font-[family-name:var(--font-display)]">
                Register New Boiler Asset
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Serial Number"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Manufacturer / Make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
                <Input
                  label="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Capacity (TPH Steam)"
                type="number"
                step="0.1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />

              <div className="p-3 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] text-xs text-[var(--ink-2)]">
                <span className="font-semibold text-[var(--ink)]">Location Rule:</span> A registered boiler starts in <code>in_warehouse</code> state. Relocating to a client site requires a recorded movement and low-bed dispatch (PRD §6.2).
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Register Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

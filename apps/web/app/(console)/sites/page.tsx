"use client";

import { useState } from "react";
import { Panel, DataTable, StatusPill, Button, Input } from "@stoker/ui";
import { Plus, Flame, UserCheck } from "lucide-react";

export default function SitesConsolePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [code, setCode] = useState("KRC-04");
  const [name, setName] = useState("Karachi Textile Works");
  const [clientName, setClientName] = useState("Indus Fibers Ltd");
  const [address, setAddress] = useState("Korangi Industrial Area, Sector 15");

  const [sitesList, setSitesList] = useState([
    {
      id: "20000000-0000-0000-0000-000000000001",
      code: "RVR-01",
      name: "Riverside Processing Mill",
      client: "Riverside Agro Corp",
      status: "active",
      boilers: "1 installed (BLR-TH-4000)",
      supervisor: "Tariq Mahmood",
      floatBalance: "$850.00",
      geofenceRadius: "300m",
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      code: "HLD-02",
      name: "Highland Biofuels Plant",
      client: "Highland Timber & Power",
      status: "draft",
      boilers: "0 assigned",
      supervisor: "Unassigned",
      floatBalance: "$0.00",
      geofenceRadius: "300m",
    },
    {
      id: "20000000-0000-0000-0000-000000000003",
      code: "FSD-03",
      name: "Faisalabad Weaving Complex",
      client: "Chenab Fabrics",
      status: "active",
      boilers: "2 installed (BLR-2001, BLR-2002)",
      supervisor: "Ali Asghar",
      floatBalance: "$1,200.00",
      geofenceRadius: "400m",
    },
  ]);

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    setSitesList([
      ...sitesList,
      {
        id: crypto.randomUUID(),
        code,
        name,
        client: clientName,
        status: "draft",
        boilers: "0 assigned",
        supervisor: "Unassigned",
        floatBalance: "$0.00",
        geofenceRadius: "300m",
      },
    ]);
    setShowCreateModal(false);
  };

  const columns = [
    {
      header: "Code & Name",
      accessor: (row: typeof sitesList[0]) => (
        <div>
          <div className="font-semibold text-[var(--ink)]">{row.name}</div>
          <div className="text-xs font-mono text-[var(--ink-3)]">{row.code} • {row.client}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: typeof sitesList[0]) => <StatusPill status={row.status} />,
    },
    {
      header: "Boilers",
      accessor: (row: typeof sitesList[0]) => (
        <span className="text-xs font-medium text-[var(--ink-2)] flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{row.boilers}</span>
        </span>
      ),
    },
    {
      header: "Supervisor",
      accessor: (row: typeof sitesList[0]) => (
        <span className="text-xs text-[var(--ink-2)] flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[var(--ok)]" />
          <span>{row.supervisor}</span>
        </span>
      ),
    },
    {
      header: "Cash Float",
      accessor: (row: typeof sitesList[0]) => (
        <span className="text-xs font-bold font-mono text-[var(--ink)]">{row.floatBalance}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
            Client Sites
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            Rental locations, boiler installations, assigned site workforce, and live petty cash floats.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Site</span>
        </Button>
      </div>

      <Panel title={`Active Sites (${sitesList.length})`}>
        <DataTable
          columns={columns}
          data={sitesList}
          keyExtractor={(item) => item.id}
        />
      </Panel>

      {/* Create Site Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-base font-bold text-[var(--ink)] font-[family-name:var(--font-display)]">
                Create New Client Site
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Site Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <Input
                  label="Site Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Client Enterprise Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />

              <Input
                label="Physical Address / Coordinates"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div className="p-3 bg-[var(--surface-sunk)] border border-[var(--line)] rounded-[var(--radius-control)] text-xs text-[var(--ink-2)]">
                <span className="font-semibold text-[var(--ink)]">Lifecycle Guard:</span> New sites are created in <code>Draft</code> state. They transition to <code>Active</code> once at least one boiler and an active site supervisor are assigned (PRD §6.1).
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Site Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

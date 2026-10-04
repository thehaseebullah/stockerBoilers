"use client";

import { useState } from "react";
import { Panel, DataTable } from "@stoker/ui";

export default function InventoryConsolePage() {
  const [stockList] = useState([
    {
      id: "1",
      sku: "SKU-CHEM-01",
      name: "Oxygen Scavenger Chemical (25L)",
      category: "Chemicals",
      location: "Central Warehouse #1",
      quantity: "48 drums",
      reorderLevel: "15 drums",
      unitCost: "$65.00",
      totalValue: "$3,120.00",
      status: "In Stock",
    },
    {
      id: "2",
      sku: "SKU-VALVE-04",
      name: "DN50 Safety Relief Valve 16 bar",
      category: "Spare Parts",
      location: "Central Warehouse #1",
      quantity: "6 units",
      reorderLevel: "4 units",
      unitCost: "$280.00",
      totalValue: "$1,680.00",
      status: "In Stock",
    },
    {
      id: "3",
      sku: "SKU-FUEL-RH",
      name: "Rice Husk Biofuel Bulk",
      category: "Fuel",
      location: "Riverside Mill (Site Storage)",
      quantity: "28.5 tonnes",
      reorderLevel: "10.0 tonnes",
      unitCost: "$95.00/t",
      totalValue: "$2,707.50",
      status: "Optimal",
    },
    {
      id: "4",
      sku: "SKU-GASKET-TH",
      name: "High-Temp Spiral Wound Gasket Set",
      category: "Spare Parts",
      location: "Faisalabad Weaving Complex",
      quantity: "2 sets",
      reorderLevel: "5 sets",
      unitCost: "$45.00",
      totalValue: "$90.00",
      status: "Low Stock",
    },
  ]);

  const columns = [
    {
      header: "SKU & Description",
      accessor: (row: typeof stockList[0]) => (
        <div>
          <div className="font-bold text-[var(--ink)] font-mono text-xs">{row.sku}</div>
          <div className="text-xs text-[var(--ink-3)]">{row.name}</div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (row: typeof stockList[0]) => (
        <span className="text-xs text-[var(--ink-2)] font-medium">{row.category}</span>
      ),
    },
    {
      header: "Location",
      accessor: (row: typeof stockList[0]) => (
        <span className="text-xs text-[var(--ink)]">{row.location}</span>
      ),
    },
    {
      header: "Derived On-Hand Stock",
      accessor: (row: typeof stockList[0]) => (
        <div>
          <div className="font-bold text-xs text-[var(--ink)]">{row.quantity}</div>
          <div className="text-[10px] text-[var(--ink-3)]">Reorder: {row.reorderLevel}</div>
        </div>
      ),
    },
    {
      header: "Valuation (WAC)",
      accessor: (row: typeof stockList[0]) => (
        <div>
          <div className="font-mono text-xs font-semibold">{row.totalValue}</div>
          <div className="text-[10px] text-[var(--ink-3)]">@{row.unitCost}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: typeof stockList[0]) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
            row.status === "Low Stock"
              ? "bg-[var(--danger-sunk)] text-[var(--danger)]"
              : "bg-[var(--ok-sunk)] text-[var(--ok)]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
            Inventory & Warehouses
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-1">
            Spare parts, chemicals, and bulk biofuel stock across warehouses and operating sites.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs font-medium text-[var(--ink-3)]">Total Stock Valuation</div>
          <div className="text-2xl font-bold mt-1 text-[var(--ink)] font-[family-name:var(--font-display)]">
            $7,597.50
          </div>
          <div className="text-xs text-[var(--ink-3)] mt-1">Across 2 warehouses & 2 sites</div>
        </div>

        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs font-medium text-[var(--ink-3)]">Biofuel Reserves</div>
          <div className="text-2xl font-bold mt-1 text-[var(--ok)] font-[family-name:var(--font-display)]">
            28.5 Tonnes
          </div>
          <div className="text-xs text-[var(--ok)] mt-1">~6.5 days burn rate at 4T</div>
        </div>

        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
          <div className="text-xs font-medium text-[var(--ink-3)]">Reorder Alerts</div>
          <div className="text-2xl font-bold mt-1 text-[var(--warning)] font-[family-name:var(--font-display)]">
            1 Item Low
          </div>
          <div className="text-xs text-[var(--warning)] mt-1">High-Temp Spiral Gaskets</div>
        </div>
      </div>

      <Panel title="Stock By Location (Derived from Movement Lines)">
        <DataTable
          columns={columns}
          data={stockList}
          keyExtractor={(item) => item.id}
        />
      </Panel>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Panel, DataTable, StatusPill, Button } from "@stoker/ui";

export default function HRConsolePage() {
  const [employeesList] = useState([
    {
      id: "60000000-0000-0000-0000-000000000001",
      code: "EMP-001",
      name: "Tariq Mahmood",
      role: "Site Supervisor",
      site: "Riverside Mill (RVR-01)",
      shift: "Day Shift (08:00 – 20:00)",
      attendance: "Checked In (07:54 AM)",
      status: "active",
      phone: "+92 300 1234567",
    },
    {
      id: "60000000-0000-0000-0000-000000000002",
      code: "EMP-002",
      name: "Ali Asghar",
      role: "Boiler Operator",
      site: "Riverside Mill (RVR-01)",
      shift: "Day Shift (08:00 – 20:00)",
      attendance: "Checked In (08:02 AM)",
      status: "active",
      phone: "+92 301 9876543",
    },
    {
      id: "60000000-0000-0000-0000-000000000003",
      code: "EMP-003",
      name: "Zubair Khan",
      role: "Boiler Operator",
      site: "Faisalabad Weaving Complex",
      shift: "Night Shift (20:00 – 08:00)",
      attendance: "Off Duty",
      status: "active",
      phone: "+92 333 5551212",
    },
    {
      id: "60000000-0000-0000-0000-000000000004",
      code: "DRV-001",
      name: "Rasheed Ahmed",
      role: "Truck Driver",
      site: "Central Fleet (Logistics)",
      shift: "Dispatch Duty",
      attendance: "On Route (LES-9921)",
      status: "active",
      phone: "+92 321 4443322",
    },
  ]);

  const [leaveRequestsList, setLeaveRequestsList] = useState([
    {
      id: "1",
      employee: "Ali Asghar",
      leaveType: "Annual Leave",
      period: "2026-03-15 to 2026-03-18 (4 days)",
      reason: "Family function in village",
      status: "pending",
    },
  ]);

  const handleApproveLeave = (id: string) => {
    setLeaveRequestsList((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l))
    );
  };

  const employeeColumns = [
    {
      header: "Employee & Code",
      accessor: (row: typeof employeesList[0]) => (
        <div>
          <div className="font-bold text-[var(--ink)] text-xs">{row.name}</div>
          <div className="text-[11px] font-mono text-[var(--ink-3)]">{row.code} • {row.phone}</div>
        </div>
      ),
    },
    {
      header: "Designation",
      accessor: (row: typeof employeesList[0]) => (
        <span className="text-xs font-medium text-[var(--primary)]">{row.role}</span>
      ),
    },
    {
      header: "Assigned Site",
      accessor: (row: typeof employeesList[0]) => (
        <div>
          <div className="text-xs font-semibold text-[var(--ink)]">{row.site}</div>
          <div className="text-[10px] text-[var(--ink-3)]">Strict 1-Site Constraint Enforced</div>
        </div>
      ),
    },
    {
      header: "Current Shift & Attendance",
      accessor: (row: typeof employeesList[0]) => (
        <div>
          <div className="text-xs text-[var(--ink-2)]">{row.shift}</div>
          <div className="text-[11px] font-semibold text-[var(--ok)]">{row.attendance}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: typeof employeesList[0]) => <StatusPill status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-display)]">
          Workforce, Shifts & Attendance
        </h1>
        <p className="text-sm text-[var(--ink-3)] mt-1">
          Site operators, supervisors, shift roster schedules, and real-time geofenced attendance logs.
        </p>
      </div>

      <Panel title={`Site Workforce Roster (${employeesList.length})`}>
        <DataTable
          columns={employeeColumns}
          data={employeesList}
          keyExtractor={(item) => item.id}
        />
      </Panel>

      <Panel title="Pending Leave Requests">
        <div className="divide-y divide-[var(--line)] text-xs">
          {leaveRequestsList.map((req) => (
            <div key={req.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[var(--ink)]">{req.employee} — {req.leaveType}</div>
                <div className="text-xs text-[var(--ink-2)] mt-0.5">{req.period}</div>
                <div className="text-xs text-[var(--ink-3)] italic">Reason: {req.reason}</div>
              </div>

              <div className="flex items-center gap-2">
                {req.status === "pending" ? (
                  <>
                    <Button
                      variant="primary"
                      className="h-8 text-xs px-3"
                      onClick={() => handleApproveLeave(req.id)}
                    >
                      Approve Leave
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 text-xs px-3"
                    >
                      Decline
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-[var(--ok)]">Approved ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  MapPin,
  Flame,
  Phone,
  Clock,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Briefcase,
  DollarSign,
  Filter,
} from "lucide-react";
import { DemoStore, DemoWorker, DemoBoiler } from "../../demo-store";

export default function HRConsolePage() {
  const [staff, setStaff] = useState<DemoWorker[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal State for Add Staff
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<DemoWorker["role"]>("Lead Boiler Operator");
  const [assignedBoilerId, setAssignedBoilerId] = useState("");
  const [shift, setShift] = useState<DemoWorker["shift"]>("Morning (06:00 - 14:00)");
  const [phone, setPhone] = useState("+92 ");
  const [dailyWage, setDailyWage] = useState("$35.00");

  // Modal State for Edit Staff
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<DemoWorker["role"]>("Lead Boiler Operator");
  const [editBoilerId, setEditBoilerId] = useState("");
  const [editShift, setEditShift] = useState<DemoWorker["shift"]>("Morning (06:00 - 14:00)");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState<DemoWorker["status"]>("active");

  const refresh = () => {
    setStaff(DemoStore.getStaff());
    setBoilers(DemoStore.getBoilers());
  };

  useEffect(() => {
    refresh();
    const unsub = DemoStore.subscribe(() => {
      refresh();
    });
    return () => unsub();
  }, []);

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedSite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter !== "All" && s.role !== roleFilter) return false;
    return true;
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBoiler = boilers.find((b) => b.id === (assignedBoilerId || boilers[0]?.id));
    const randomAvatar = `https://images.unsplash.com/photo-${
      ["1534528741775-53994a69daeb", "1507003211169-0a1dd7228f2d", "1500648767791-00dcc994a43e", "1492562080023-ab3db95bfbce", "1522075469751-3a6694fb2f61"][
        Math.floor(Math.random() * 5)
      ]
    }?w=100&auto=format&fit=crop&q=80`;

    DemoStore.addStaff({
      name,
      role,
      assignedBoilerId: targetBoiler ? targetBoiler.id : "blr-01",
      assignedSite: targetBoiler ? targetBoiler.siteName : "Apex Textile Mills - Sector 4",
      shift,
      status: "active",
      phone: phone || "+92 300 0000000",
      avatar: randomAvatar,
      dailyWage,
    });

    setName("");
    setPhone("+92 ");
    setAddModalOpen(false);
  };

  const openEditModal = (worker: DemoWorker) => {
    setEditingStaffId(worker.id);
    setEditName(worker.name);
    setEditRole(worker.role);
    setEditBoilerId(worker.assignedBoilerId);
    setEditShift(worker.shift);
    setEditPhone(worker.phone);
    setEditStatus(worker.status);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffId) return;
    const targetBoiler = boilers.find((b) => b.id === editBoilerId);

    DemoStore.updateStaff(editingStaffId, {
      name: editName,
      role: editRole,
      assignedBoilerId: editBoilerId,
      assignedSite: targetBoiler ? targetBoiler.siteName : "Apex Textile Mills",
      shift: editShift,
      phone: editPhone,
      status: editStatus,
    });

    setEditModalOpen(false);
    setEditingStaffId(null);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Remove ${name} from active staff?`)) {
      DemoStore.deleteStaff(id);
    }
  };

  // KPI counters
  const totalStaff = staff.length;
  const activeCount = staff.filter((s) => s.status === "active").length;
  const operatorsCount = staff.filter((s) => s.role.includes("Operator")).length;

  return (
    <div className="space-y-6">
      {/* Title & Top Stats Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
            Staff & HRM Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Recruit, assign, and organize operators and technicians stationed across all facility boilers.
          </p>
        </div>

        {/* 3 Summary HRM Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs text-center min-w-[120px]">
            <span className="text-[11px] font-medium text-gray-500 block">Total Staff</span>
            <span className="text-xl font-bold text-gray-900 mt-0.5 block">{totalStaff}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs text-center min-w-[120px]">
            <span className="text-[11px] font-medium text-gray-500 block">Active On-Shift</span>
            <span className="text-xl font-bold text-emerald-600 mt-0.5 block">{activeCount}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs text-center min-w-[120px]">
            <span className="text-[11px] font-medium text-gray-500 block">Lead Operators</span>
            <span className="text-xl font-bold text-[#FF6600] mt-0.5 block">{operatorsCount}</span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-6">
        {/* Controls: Search, Filter, and Add Staff Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, code, site, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F3F4F7] text-xs rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-[#F3F4F7] text-gray-700 rounded-xl border border-transparent focus:border-[#FF6600] focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Lead Boiler Operator">Lead Operators</option>
                <option value="Biomass Fuel Feeder">Fuel Feeders</option>
                <option value="Maintenance Specialist">Maintenance</option>
                <option value="Water Treatment Tech">Water Treatment</option>
                <option value="Shift Supervisor">Supervisors</option>
              </select>
            </div>
          </div>

          {/* Add Staff Button */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(255,102,0,0.25)] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3 pl-3">Employee</th>
                <th className="pb-3">Designation / Role</th>
                <th className="pb-3">Stationed Boiler & Site</th>
                <th className="pb-3">Shift & Attendance</th>
                <th className="pb-3">Wage / Allowance</th>
                <th className="pb-3 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((worker) => {
                const assignedBoiler = boilers.find((b) => b.id === worker.assignedBoilerId);
                return (
                  <tr key={worker.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Employee Info */}
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.avatar}
                          alt={worker.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">{worker.name}</span>
                          <span className="text-[11px] font-mono text-gray-400 block mt-0.5">
                            {worker.code} • {worker.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-[#FF6600] border border-orange-200/60">
                        {worker.role}
                      </span>
                    </td>

                    {/* Assigned Boiler & Site */}
                    <td className="py-3.5">
                      <div>
                        <span className="font-semibold text-gray-800 block">
                          {assignedBoiler ? assignedBoiler.model : "Boiler Unit"}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#FF6600]" />
                          <span>{worker.assignedSite}</span>
                        </div>
                      </div>
                    </td>

                    {/* Shift & Status */}
                    <td className="py-3.5">
                      <div>
                        <span className="text-gray-700 block font-medium">{worker.shift}</span>
                        <span
                          className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            worker.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          ● {worker.status === "active" ? "On Duty" : "Off Duty"}
                        </span>
                      </div>
                    </td>

                    {/* Wage */}
                    <td className="py-3.5">
                      <span className="font-bold text-gray-900">{worker.dailyWage}</span>
                      <span className="text-[10px] text-gray-400 block">/day shift</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(worker)}
                          title="Edit staff details"
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(worker.id, worker.name)}
                          title="Remove staff member"
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStaff.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-400">
              No staff members found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD NEW STAFF MEMBER */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Register New Staff Member
                </h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mahmood"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Designation / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  >
                    <option value="Lead Boiler Operator">Lead Boiler Operator</option>
                    <option value="Biomass Fuel Feeder">Biomass Fuel Feeder</option>
                    <option value="Maintenance Specialist">Maintenance Specialist</option>
                    <option value="Water Treatment Tech">Water Treatment Tech</option>
                    <option value="Shift Supervisor">Shift Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Assigned Shift
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  >
                    <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                    <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                    <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Station At Boiler & Site
                </label>
                <select
                  value={assignedBoilerId}
                  onChange={(e) => setAssignedBoilerId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                >
                  <option value="">-- Select Boiler Deployment --</option>
                  {boilers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.model} • {b.siteName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Daily Wage / Rate
                  </label>
                  <input
                    type="text"
                    value={dailyWage}
                    onChange={(e) => setDailyWage(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-orange-600 rounded-xl shadow-xs disabled:opacity-50"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT STAFF MEMBER */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Edit Staff Assignment
                </h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Designation / Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  >
                    <option value="Lead Boiler Operator">Lead Boiler Operator</option>
                    <option value="Biomass Fuel Feeder">Biomass Fuel Feeder</option>
                    <option value="Maintenance Specialist">Maintenance Specialist</option>
                    <option value="Water Treatment Tech">Water Treatment Tech</option>
                    <option value="Shift Supervisor">Shift Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Duty Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  >
                    <option value="active">Active (On Duty)</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Reassign Boiler & Site
                </label>
                <select
                  value={editBoilerId}
                  onChange={(e) => setEditBoilerId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                >
                  {boilers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.model} • {b.siteName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Shift
                  </label>
                  <select
                    value={editShift}
                    onChange={(e) => setEditShift(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  >
                    <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                    <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                    <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-orange-600 rounded-xl shadow-xs"
                >
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

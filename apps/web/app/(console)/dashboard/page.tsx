"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  PauseCircle,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Building,
  Fuel,
  Activity,
  Layers,
  Phone,
  Calendar,
} from "lucide-react";
import { DemoStore, DemoBoiler, DemoWorker, DemoExpense } from "../../demo-store";

export default function DashboardPage() {
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [selectedBoilerId, setSelectedBoilerId] = useState<string>("blr-02"); // default select second card like reference
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Sub-modal for logging an expense from boiler details
  const [logExpenseModalOpen, setLogExpenseModalOpen] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState("45.00");
  const [newExpenseCategory, setNewExpenseCategory] = useState<DemoExpense["category"]>("Biomass Fuel");
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseWorker, setNewExpenseWorker] = useState("");

  // Sub-modal for assigning a worker from boiler details
  const [assignWorkerModalOpen, setAssignWorkerModalOpen] = useState(false);
  const [selectedWorkerToAssign, setSelectedWorkerToAssign] = useState("");

  const refreshData = () => {
    setBoilers(DemoStore.getBoilers());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = DemoStore.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  const selectedBoiler = boilers.find((b) => b.id === selectedBoilerId) || boilers[0];
  const assignedWorkers = selectedBoiler ? DemoStore.getStaffForBoiler(selectedBoiler.id) : [];
  const boilerExpenses = selectedBoiler ? DemoStore.getExpensesForBoiler(selectedBoiler.id) : [];
  const allStaff = DemoStore.getStaff();
  const unassignedStaff = allStaff.filter((s) => s.assignedBoilerId !== selectedBoiler?.id);

  // Filtered boilers
  const filteredBoilers = boilers.filter((b) => {
    const matchesSearch =
      b.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "All") return true;
    if (statusFilter === "Operational") return b.status === "operational";
    if (statusFilter === "In Maintenance") return b.status === "maintenance";
    if (statusFilter === "Standby") return b.status === "standby";
    if (statusFilter === "Issue Detected") return b.status === "issue";
    return true;
  });

  const handleCardClick = (boiler: DemoBoiler) => {
    setSelectedBoilerId(boiler.id);
    setDetailModalOpen(true);
  };

  const handleStatusChange = (status: DemoBoiler["status"]) => {
    if (!selectedBoiler) return;
    DemoStore.updateBoilerStatus(selectedBoiler.id, status);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoiler) return;
    const amountNum = parseFloat(newExpenseAmount) || 0;
    DemoStore.addExpense({
      boilerId: selectedBoiler.id,
      boilerModel: selectedBoiler.model,
      siteName: selectedBoiler.siteName,
      amount: amountNum,
      category: newExpenseCategory,
      description: newExpenseDescription || `${newExpenseCategory} replenishment`,
      loggedBy: newExpenseWorker || selectedBoiler.leadOperatorName,
    });
    setNewExpenseDescription("");
    setLogExpenseModalOpen(false);
  };

  const handleAssignWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoiler || !selectedWorkerToAssign) return;
    DemoStore.updateStaff(selectedWorkerToAssign, {
      assignedBoilerId: selectedBoiler.id,
      assignedSite: selectedBoiler.siteName,
    });
    setSelectedWorkerToAssign("");
    setAssignWorkerModalOpen(false);
  };

  // KPI Calculations
  const totalCount = boilers.length;
  const operationalCount = boilers.filter((b) => b.status === "operational").length;
  const maintenanceCount = boilers.filter((b) => b.status === "maintenance").length;
  const otherCount = boilers.filter((b) => b.status === "standby" || b.status === "issue").length;

  return (
    <div className="space-y-6">
      {/* Top Title & Header KPI Section matching the reference image */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
            Boilers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all your fleet boilers across client sites in one place.
          </p>
        </div>

        {/* 4 Summary KPI Cards in row just like FleetTrack image */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Total Boilers */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between min-w-[140px]">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
              <Flame className="w-5 h-5 text-gray-800" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-gray-500 block">Total Boilers</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-gray-900 leading-none">{totalCount.toString().padStart(2, "0")}</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center">
                  ↑ 3.5%
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Active Boilers */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between min-w-[140px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-gray-500 block">Active Boilers</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-gray-900 leading-none">{operationalCount.toString().padStart(2, "0")}</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center">
                  ↑ 1.5%
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: In Maintenance */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between min-w-[140px]">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-gray-500 block">In Maintenance</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-gray-900 leading-none">{maintenanceCount.toString().padStart(2, "0")}</span>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center">
                  ↑ 2.5%
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Inactive / Standby */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between min-w-[140px]">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <PauseCircle className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-gray-500 block">Inactive / Standby</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-gray-900 leading-none">{otherCount.toString().padStart(2, "0")}</span>
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full flex items-center">
                  ↓ 3.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-6">
        {/* Sub Header: Boilers List Title, Search Box, and Status Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900 font-[family-name:var(--font-display)]">
              Boilers List
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              ({filteredBoilers.length} units available)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input Box with Icon */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for Boilers ID or Site..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F3F4F7] text-xs rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: "All", value: "All" },
                { label: "Operational", value: "Operational" },
                { label: "In Maintenance", value: "In Maintenance" },
                { label: "Standby", value: "Standby" },
                { label: "Issue Detected", value: "Issue Detected" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === f.value
                      ? "bg-[#181B20] text-white shadow-xs"
                      : "bg-[#F3F4F7] text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Column Boiler Cards Grid matching the 4x2 layout in the reference image! */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBoilers.map((b) => {
            const isSelected = selectedBoilerId === b.id;
            const staffList = DemoStore.getStaffForBoiler(b.id);
            const leadWorker = staffList[0];

            return (
              <div
                key={b.id}
                onClick={() => handleCardClick(b)}
                className={`group rounded-2xl p-4.5 bg-white border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? "border-[#FF6600] ring-2 ring-[#FF6600]/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {/* Top of Card: Model, ID, and Status Pill */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 tracking-tight leading-tight group-hover:text-[#FF6600] transition-colors">
                        {b.model}
                      </h3>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                        {b.code}
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        b.status === "operational"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                          : b.status === "maintenance"
                          ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                          : b.status === "issue"
                          ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                          : "bg-sky-50 text-sky-600 border border-sky-200/60"
                      }`}
                    >
                      {b.statusLabel}
                    </span>
                  </div>

                  {/* Site Location Pill Banner */}
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    <MapPin className="w-3 h-3 text-[#FF6600] shrink-0" />
                    <span className="truncate font-medium">{b.siteName}</span>
                  </div>

                  {/* Clean Industrial Boiler Picture in the center of card */}
                  <div className="relative w-full h-36 my-3 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 group-hover:scale-[1.02] transition-transform duration-200">
                    <img
                      src={b.image}
                      alt={b.model}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  {/* Worker Row matching image: Lead Worker Avatar, Name, Last Update */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={
                          leadWorker?.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        }
                        alt={b.leadOperatorName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 block leading-none">Lead Operator</span>
                        <span className="text-xs font-semibold text-gray-800 truncate block">
                          {leadWorker ? leadWorker.name : b.leadOperatorName}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      Last update: {b.lastUpdateMins} min ago
                    </span>
                  </div>
                </div>

                {/* Bottom Timeline/Progress Indicator Bar with Orange Markers matching reference */}
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                  <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#FF6600] rounded-full"
                      style={{
                        width:
                          b.status === "operational"
                            ? "78%"
                            : b.status === "maintenance"
                            ? "35%"
                            : "15%",
                      }}
                    />
                  </div>

                  {/* Key Operational Metrics: Running Expense, Steam Capacity, Hours */}
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 pt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
                      <span className="font-bold text-gray-800">${b.dailyRunningCost.toFixed(0)}</span>
                      <span className="text-[10px] text-gray-400">/day</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">{b.capacityKgPerHour}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{b.operatingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination matching the reference image */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div>
            Showing 1 to {filteredBoilers.length} of {boilers.length} boilers
          </div>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">
              &lt;
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#181B20] text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* BOILER DETAILS MODAL / DRAWER (Point 4 of Prompt) */}
      {detailModalOpen && selectedBoiler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6600]/10 text-[#FF6600] flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-gray-900 font-[family-name:var(--font-display)]">
                      {selectedBoiler.model}
                    </h2>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {selectedBoiler.code}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Client: {selectedBoiler.clientName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedBoiler.status === "operational"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : selectedBoiler.status === "maintenance"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : selectedBoiler.status === "issue"
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-sky-50 text-sky-600 border border-sky-200"
                  }`}
                >
                  ● {selectedBoiler.statusLabel}
                </span>

                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 flex-1">
              {/* Top Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Image & Status Quick Switcher */}
                <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-gray-100 flex flex-col justify-between items-center text-center">
                  <div className="w-full h-44 flex items-center justify-center">
                    <img
                      src={selectedBoiler.image}
                      alt={selectedBoiler.model}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  <div className="w-full pt-3 border-t border-gray-200/60">
                    <span className="text-[11px] font-semibold text-gray-400 block mb-2 uppercase tracking-wider">
                      Quick Status Switch
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleStatusChange("operational")}
                        className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors ${
                          selectedBoiler.status === "operational"
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
                        }`}
                      >
                        Operational
                      </button>
                      <button
                        onClick={() => handleStatusChange("maintenance")}
                        className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors ${
                          selectedBoiler.status === "maintenance"
                            ? "bg-amber-600 text-white"
                            : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200"
                        }`}
                      >
                        Maintenance
                      </button>
                      <button
                        onClick={() => handleStatusChange("standby")}
                        className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors ${
                          selectedBoiler.status === "standby"
                            ? "bg-sky-600 text-white"
                            : "bg-white text-gray-700 hover:bg-sky-50 border border-gray-200"
                        }`}
                      >
                        Standby
                      </button>
                      <button
                        onClick={() => handleStatusChange("issue")}
                        className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors ${
                          selectedBoiler.status === "issue"
                            ? "bg-rose-600 text-white"
                            : "bg-white text-gray-700 hover:bg-rose-50 border border-gray-200"
                        }`}
                      >
                        Issue
                      </button>
                    </div>
                  </div>
                </div>

                {/* Site Location & Deployment Details */}
                <div className="md:col-span-2 bg-[#F8F9FB] rounded-2xl p-5 border border-gray-100 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1 rounded-md bg-[#FF6600]/10 text-[#FF6600]">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Operating Site Location
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedBoiler.siteName}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedBoiler.siteLocation}
                    </p>
                  </div>

                  {/* Fact Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200/60">
                    <div className="bg-white p-3 rounded-xl border border-gray-200/60">
                      <span className="text-[10px] text-gray-400 font-medium block">Steam Output</span>
                      <span className="text-sm font-bold text-gray-800 mt-0.5 block">{selectedBoiler.capacityKgPerHour}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200/60">
                      <span className="text-[10px] text-gray-400 font-medium block">Fuel Ingestion</span>
                      <span className="text-xs font-bold text-gray-800 mt-0.5 block truncate" title={selectedBoiler.fuelType}>
                        {selectedBoiler.fuelType}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200/60">
                      <span className="text-[10px] text-gray-400 font-medium block">Hours Logged</span>
                      <span className="text-sm font-bold text-gray-800 mt-0.5 block">{selectedBoiler.operatingHours}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200/60">
                      <span className="text-[10px] text-gray-400 font-medium block">Today&apos;s Expense</span>
                      <span className="text-sm font-bold text-[#FF6600] mt-0.5 block">
                        ${selectedBoiler.dailyRunningCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: WORKERS WORKING ON THIS BOILER (Requirement 4) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FF6600]" />
                    <h3 className="text-base font-bold text-gray-900">
                      Workers On This Boiler
                    </h3>
                    <span className="text-xs font-bold text-[#FF6600] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {assignedWorkers.length} Active Staff
                    </span>
                  </div>

                  <button
                    onClick={() => setAssignWorkerModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#FF6600] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full border border-orange-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign Staff</span>
                  </button>
                </div>

                {assignedWorkers.length === 0 ? (
                  <div className="p-6 text-center bg-gray-50 rounded-2xl border border-gray-200/60 text-xs text-gray-500">
                    No operators currently assigned. Click &quot;Assign Staff&quot; above to assign employees.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assignedWorkers.map((w) => (
                      <div
                        key={w.id}
                        className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs hover:border-orange-300 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={w.avatar}
                            alt={w.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-gray-900 block truncate">
                              {w.name}
                            </span>
                            <span className="text-[11px] font-medium text-[#FF6600] block truncate">
                              {w.role}
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              {w.shift}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full block text-center ${
                              w.status === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {w.status === "active" ? "On Shift" : "Off Duty"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono block mt-1">
                            {w.phone}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: RUNNING EXPENSES FOR THIS BOILER (Requirement 4 & 6) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-base font-bold text-gray-900">
                      Running Expenses & Consumables
                    </h3>
                    <span className="text-xs font-semibold text-gray-500">
                      Total Today: ${selectedBoiler.dailyRunningCost.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => setLogExpenseModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-white bg-[#181B20] hover:bg-black px-3.5 py-1.5 rounded-full shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Running Expense</span>
                  </button>
                </div>

                <div className="bg-[#F8F9FB] rounded-2xl border border-gray-200/80 overflow-hidden">
                  {boilerExpenses.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500">
                      No expenses logged today yet. Use &quot;Log Running Expense&quot; or the Mobile Simulator to submit.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {boilerExpenses.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center text-xs font-bold shrink-0">
                              <Fuel className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-900">
                                  {exp.category}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  by {exp.loggedBy}
                                </span>
                              </div>
                              <span className="text-xs text-gray-600 block mt-0.5">
                                {exp.description}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-gray-900">
                              ${exp.amount.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-gray-400 block font-mono">
                              {exp.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 rounded-b-3xl flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Operating under Stoker Biofuel Steam-As-A-Service SLA
              </span>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 text-xs font-bold bg-[#181B20] text-white hover:bg-black rounded-xl transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: LOG EXPENSE (Direct from Boiler Modal) */}
      {logExpenseModalOpen && selectedBoiler && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#FF6600]" />
                <h3 className="text-base font-bold text-gray-900">
                  Log Running Expense
                </h3>
              </div>
              <button
                onClick={() => setLogExpenseModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Boiler & Site
                </label>
                <div className="text-xs font-medium text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  {selectedBoiler.model} • {selectedBoiler.siteName}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Expense Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Expense Category
                </label>
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                >
                  <option value="Biomass Fuel">Biomass Fuel (Pellets / Briquettes)</option>
                  <option value="Water Treatment">Water Treatment & Chemicals</option>
                  <option value="Lubricants & Oils">Lubricants & Oils</option>
                  <option value="Spare Parts">Spare Parts & Valve Sealings</option>
                  <option value="Crew Allowance">Crew Meal / Tea Allowance</option>
                  <option value="General Running">General Running Expense</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Description / Item Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 bags wood pellets top-up"
                  required
                  value={newExpenseDescription}
                  onChange={(e) => setNewExpenseDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Logged By (Worker / Operator)
                </label>
                <input
                  type="text"
                  placeholder={selectedBoiler.leadOperatorName}
                  value={newExpenseWorker}
                  onChange={(e) => setNewExpenseWorker(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLogExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-orange-600 rounded-xl shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: ASSIGN STAFF TO THIS BOILER */}
      {assignWorkerModalOpen && selectedBoiler && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF6600]" />
                <h3 className="text-base font-bold text-gray-900">
                  Assign Staff to {selectedBoiler.model}
                </h3>
              </div>
              <button
                onClick={() => setAssignWorkerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignWorker} className="space-y-4">
              <p className="text-xs text-gray-500">
                Select an available worker from your organization to station at {selectedBoiler.siteName}:
              </p>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Choose Staff Member
                </label>
                <select
                  required
                  value={selectedWorkerToAssign}
                  onChange={(e) => setSelectedWorkerToAssign(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                >
                  <option value="">-- Select an employee --</option>
                  {unassignedStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role}) • Currently at {s.assignedSite}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignWorkerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedWorkerToAssign}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-orange-600 rounded-xl shadow-xs disabled:opacity-50"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

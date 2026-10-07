"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  DollarSign,
  Fuel,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  MapPin,
  RefreshCw,
  Send,
  Zap,
} from "lucide-react";
import { DemoStore, DemoBoiler, DemoExpense, DemoWorker } from "../demo-store";

export default function SimulatorPage() {
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [staff, setStaff] = useState<DemoWorker[]>([]);
  const [expenses, setExpenses] = useState<DemoExpense[]>([]);

  // Mobile App State
  const [selectedBoilerId, setSelectedBoilerId] = useState("blr-01");
  const [selectedWorkerId, setSelectedWorkerId] = useState("emp-01");
  const [expenseAmount, setExpenseAmount] = useState("45.00");
  const [expenseCategory, setExpenseCategory] = useState<DemoExpense["category"]>("Biomass Fuel");
  const [expenseDesc, setExpenseDesc] = useState("Biomass pellet loading - 1.2 Ton batch");
  const [submitting, setSubmitting] = useState(false);
  const [successNotif, setSuccessNotif] = useState(false);

  const refresh = () => {
    setBoilers(DemoStore.getBoilers());
    setStaff(DemoStore.getStaff());
    setExpenses(DemoStore.getExpenses());
  };

  useEffect(() => {
    refresh();
    const unsub = DemoStore.subscribe(() => {
      refresh();
    });
    return () => unsub();
  }, []);

  const activeBoiler = boilers.find((b) => b.id === selectedBoilerId) || boilers[0];
  const activeWorker = staff.find((s) => s.id === selectedWorkerId) || staff[0];

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoiler) return;

    setSubmitting(true);
    const amountNum = parseFloat(expenseAmount) || 0;

    setTimeout(() => {
      DemoStore.addExpense({
        boilerId: activeBoiler.id,
        boilerModel: activeBoiler.model,
        siteName: activeBoiler.siteName,
        amount: amountNum,
        category: expenseCategory,
        description: expenseDesc || `${expenseCategory} replenishment`,
        loggedBy: activeWorker ? activeWorker.name : "Liam Harper",
      });

      setSubmitting(false);
      setSuccessNotif(true);
      setTimeout(() => setSuccessNotif(false), 3500);
    }, 300);
  };

  const handleQuickPreset = (val: string, desc: string, cat: DemoExpense["category"]) => {
    setExpenseAmount(val);
    setExpenseDesc(desc);
    setExpenseCategory(cat);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#FF6600] border border-orange-200">
              <Zap className="w-3 h-3" />
              Employee Mobile Simulator
            </span>
            <span className="text-xs text-gray-400 font-mono">Real-time local sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
            Field Employee Simulator
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Demonstrates how an on-site boiler operator logs running expenses directly from their mobile phone.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#181B20] hover:bg-black text-white text-xs font-bold rounded-xl transition-all self-start sm:self-auto shadow-xs"
        >
          <span>View on Main Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Simulator Workspace: Phone on Left, Real-time Dashboard Sync on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / CENTER: Smartphone Mockup (Employee Portal) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[390px] bg-black rounded-[46px] p-3.5 shadow-2xl ring-1 ring-gray-900/10">
            {/* Phone Screen Shell */}
            <div className="bg-[#F8F9FB] rounded-[38px] overflow-hidden border border-gray-800 flex flex-col min-h-[680px]">
              {/* Phone Status Bar */}
              <div className="bg-white px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-gray-900 border-b border-gray-100">
                <span>9:41</span>
                {/* Dynamic island notch */}
                <div className="w-20 h-4 bg-black rounded-full" />
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-gray-500 font-bold">5G</span>
                </div>
              </div>

              {/* Mobile App Header */}
              <div className="bg-white px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6600] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    <Flame className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 block leading-tight">
                      STOKER FIELD
                    </span>
                    <span className="text-[10px] text-[#FF6600] font-semibold">
                      Boiler Operator Portal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>On Duty</span>
                </div>
              </div>

              {/* Mobile App Scrollable Content */}
              <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Operator Identity Card */}
                <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        activeWorker?.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      }
                      alt="Operator"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/20"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">
                        {activeWorker?.name || "Liam Harper"}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-medium">
                        {activeWorker?.role || "Lead Boiler Operator"}
                      </span>
                    </div>
                  </div>

                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="text-[10px] bg-gray-100 text-gray-700 font-semibold py-1 px-2 rounded-lg border-none"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boiler Selector Card */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Target Boiler
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ● Active
                    </span>
                  </div>

                  <select
                    value={selectedBoilerId}
                    onChange={(e) => setSelectedBoilerId(e.target.value)}
                    className="w-full p-2 bg-[#F3F4F7] border border-gray-200 rounded-xl font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6600]"
                  >
                    {boilers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.model} ({b.code})
                      </option>
                    ))}
                  </select>

                  {activeBoiler && (
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-gray-500 truncate max-w-[200px]">
                        <MapPin className="w-3 h-3 text-[#FF6600] shrink-0" />
                        <span className="truncate">{activeBoiler.siteName}</span>
                      </div>
                      <div className="font-bold text-[#FF6600]">
                        ${activeBoiler.dailyRunningCost.toFixed(2)} today
                      </div>
                    </div>
                  )}
                </div>

                {/* Success Notification Alert */}
                {successNotif && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-700 text-xs font-semibold animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Expense logged! Synced to Dashboard instantly.</span>
                  </div>
                )}

                {/* The Focused Expense Form (Point 6) */}
                <form
                  onSubmit={handleSubmitExpense}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#FF6600]" />
                      Add Running Expense
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">Quick Entry</span>
                  </div>

                  {/* Preset Buttons for Quick Testing */}
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 block mb-1">
                      Quick Presets:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickPreset("85.00", "Biomass briquette 2.5T feed", "Biomass Fuel")
                        }
                        className="py-1 px-1.5 bg-orange-50 text-[#FF6600] hover:bg-orange-100 rounded-lg text-[10px] font-bold border border-orange-200"
                      >
                        +$85 Fuel
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickPreset("35.00", "Descaling softening liquid", "Water Treatment")
                        }
                        className="py-1 px-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg text-[10px] font-bold border border-sky-200"
                      >
                        +$35 Water
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickPreset("25.00", "Shift crew lunch & tea stipend", "Crew Allowance")
                        }
                        className="py-1 px-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-[10px] font-bold border border-purple-200"
                      >
                        +$25 Crew
                      </button>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                      Amount ($ USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.50"
                        required
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 bg-[#F3F4F7] font-bold text-sm text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Expense Category */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                      Category
                    </label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as any)}
                      className="w-full p-2 bg-[#F3F4F7] text-xs font-medium text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
                    >
                      <option value="Biomass Fuel">Biomass Fuel (Pellets / Briquettes)</option>
                      <option value="Water Treatment">Water Treatment & Chemicals</option>
                      <option value="Lubricants & Oils">Machine Lubricants & Gear Oil</option>
                      <option value="Spare Parts">Spare Parts & Valve Gaskets</option>
                      <option value="Crew Allowance">Crew Tea & Meal Allowance</option>
                      <option value="General Running">General Site Running</option>
                    </select>
                  </div>

                  {/* Description / Note */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                      Description / Item Note
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5 bags wood pellets"
                      value={expenseDesc}
                      onChange={(e) => setExpenseDesc(e.target.value)}
                      className="w-full p-2 bg-[#F3F4F7] text-xs font-medium text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(255,102,0,0.3)] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Running Expense</span>
                  </button>
                </form>
              </div>

              {/* Phone Home Bar */}
              <div className="bg-white py-2 flex justify-center border-t border-gray-100">
                <div className="w-32 h-1 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Real-time Telemetry & Dashboard Impact Preview */}
        <div className="lg:col-span-6 space-y-5">
          {/* Real-time Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Live Dashboard Sync
                  </h3>
                  <span className="text-xs text-gray-400">
                    Zero latency, instant operational broadcast
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Connected</span>
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              When the employee hits <strong>&quot;Submit Running Expense&quot;</strong> on the phone, the expense is immediately applied to that boiler&apos;s daily operational ledger, recalculating the running cost on the head office dashboard and in the boiler modal.
            </p>

            {/* Selected Boiler's Current Stats Card */}
            {activeBoiler && (
              <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-white rounded-xl border border-gray-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={activeBoiler.image}
                      alt={activeBoiler.model}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">
                      {activeBoiler.model}
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      {activeBoiler.siteName}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                    Daily Running Cost
                  </span>
                  <span className="text-lg font-extrabold text-[#FF6600]">
                    ${activeBoiler.dailyRunningCost.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Live Stream of Submitted Expenses */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-gray-900">
                Recent Expenses Stream
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {expenses.length} Total Logged
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto">
              {expenses.slice(0, 5).map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold text-xs shrink-0">
                      <Fuel className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 truncate">
                          {exp.boilerModel}
                        </span>
                        <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-md border border-gray-200 text-gray-500 font-medium shrink-0">
                          {exp.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 truncate block mt-0.5">
                        {exp.description} (by {exp.loggedBy})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-gray-900 block">
                      ${exp.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      {idx === 0 ? "Just now" : exp.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  Send,
  Fuel,
  CheckCircle2,
  Users,
} from "lucide-react";
import { DemoStore, DemoBoiler, DemoExpense, DemoWorker } from "../../../demo-store";

export default function FieldHomePage() {
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [staff, setStaff] = useState<DemoWorker[]>([]);
  const [expenses, setExpenses] = useState<DemoExpense[]>([]);

  const [selectedBoilerId, setSelectedBoilerId] = useState("blr-01");
  const [amount, setAmount] = useState("45.00");
  const [category, setCategory] = useState<DemoExpense["category"]>("Biomass Fuel");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
  const myStaff = staff[0];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoiler) return;
    const num = parseFloat(amount) || 0;

    DemoStore.addExpense({
      boilerId: activeBoiler.id,
      boilerModel: activeBoiler.model,
      siteName: activeBoiler.siteName,
      amount: num,
      category,
      description: description || `${category} replenishment`,
      loggedBy: myStaff ? myStaff.name : "Liam Harper",
    });

    setDescription("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Employee Greeting & Site Banner */}
      <div className="p-4 bg-white border border-gray-200 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Operator"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20"
            />
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                {myStaff?.name || "Liam Harper"}
              </span>
              <span className="text-[10px] text-[#FF6600] font-semibold">
                Lead Boiler Operator (On Duty)
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            ● GPS Verified
          </span>
        </div>

        {activeBoiler && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-600 truncate max-w-[240px]">
              <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
              <span className="truncate font-medium">{activeBoiler.siteName}</span>
            </div>
            <span className="font-bold text-gray-900">{activeBoiler.model}</span>
          </div>
        )}
      </div>

      {/* Target Boiler Selector */}
      <div className="p-4 bg-white border border-gray-200 rounded-3xl shadow-xs space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
          Stationed Boiler
        </label>
        <select
          value={selectedBoilerId}
          onChange={(e) => setSelectedBoilerId(e.target.value)}
          className="w-full p-2.5 bg-[#F3F4F7] text-xs font-bold text-gray-900 rounded-2xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
        >
          {boilers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.model} • {b.siteName}
            </option>
          ))}
        </select>

        {activeBoiler && (
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Today&apos;s Running Expenses:</span>
            <span className="font-extrabold text-[#FF6600] text-sm">
              ${activeBoiler.dailyRunningCost.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Primary Task: Log Boiler Running Expense */}
      {submitted && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Expense successfully logged and synchronized!</span>
        </div>
      )}

      <form
        onSubmit={handleQuickSubmit}
        className="p-5 bg-white border border-gray-200 rounded-3xl shadow-xs space-y-3.5"
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#FF6600]" />
            Log Boiler Running Expense
          </span>
          <span className="text-[10px] text-gray-400 font-medium">Field Operator</span>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[10px] font-semibold text-gray-400 block mb-1">Quick Select:</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAmount("85.00");
                setCategory("Biomass Fuel");
                setDescription("Biomass briquettes 2.5T feed");
              }}
              className="p-1.5 bg-orange-50 text-[#FF6600] rounded-xl text-[10px] font-bold border border-orange-200 text-center"
            >
              +$85 Fuel
            </button>
            <button
              type="button"
              onClick={() => {
                setAmount("35.00");
                setCategory("Water Treatment");
                setDescription("Boiler descaling chemicals");
              }}
              className="p-1.5 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-bold border border-sky-200 text-center"
            >
              +$35 Water
            </button>
            <button
              type="button"
              onClick={() => {
                setAmount("25.00");
                setCategory("Crew Allowance");
                setDescription("Shift crew meals & tea");
              }}
              className="p-1.5 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-bold border border-purple-200 text-center"
            >
              +$25 Crew
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Amount ($ USD)</label>
          <input
            type="number"
            step="0.50"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2.5 bg-[#F3F4F7] text-sm font-bold text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full p-2.5 bg-[#F3F4F7] text-xs font-medium text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
          >
            <option value="Biomass Fuel">Biomass Fuel (Pellets / Briquettes)</option>
            <option value="Water Treatment">Water Treatment Chemicals</option>
            <option value="Lubricants & Oils">Machine Lubricants & Gear Oil</option>
            <option value="Spare Parts">Spare Parts & Valve Gaskets</option>
            <option value="Crew Allowance">Crew Food & Tea Stipend</option>
            <option value="General Running">General Site Running</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Description / Item Note
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 5 bags wood pellets"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 bg-[#F3F4F7] text-xs font-medium text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(255,102,0,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Submit Running Expense</span>
        </button>
      </form>

      {/* Return to Console button */}
      <div className="text-center pt-2">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
        >
          <span>Return to Head Office Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, DollarSign, Send, ArrowLeft } from "lucide-react";
import { DemoStore } from "../../../demo-store";

export default function FieldExpensesPage() {
  const boilers = DemoStore.getBoilers();
  const [selectedBoilerId, setSelectedBoilerId] = useState(boilers[0]?.id || "blr-01");
  const [amount, setAmount] = useState("45.00");
  const [category, setCategory] = useState<any>("Biomass Fuel");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeBoiler = boilers.find((b) => b.id === selectedBoilerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoiler) return;

    DemoStore.addExpense({
      boilerId: activeBoiler.id,
      boilerModel: activeBoiler.model,
      siteName: activeBoiler.siteName,
      amount: parseFloat(amount) || 0,
      category,
      description: description || `${category} replenishment`,
      loggedBy: "Liam Harper",
    });

    setDescription("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <Link href="/f/home" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Log Running Expense</h1>
          <p className="text-xs text-gray-500">Record daily fuel, parts, and consumables</p>
        </div>
      </div>

      {submitted && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Expense saved and synced to dashboard!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 bg-white border border-gray-200 rounded-3xl shadow-xs space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Target Boiler</label>
          <select
            value={selectedBoilerId}
            onChange={(e) => setSelectedBoilerId(e.target.value)}
            className="w-full p-2.5 bg-[#F3F4F7] text-xs font-bold text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
          >
            {boilers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.model} • {b.siteName}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 bg-[#F3F4F7] text-xs font-medium text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
          >
            <option value="Biomass Fuel">Biomass Fuel</option>
            <option value="Water Treatment">Water Treatment Chemicals</option>
            <option value="Lubricants & Oils">Machine Lubricants</option>
            <option value="Spare Parts">Spare Parts</option>
            <option value="Crew Allowance">Crew Allowance</option>
            <option value="General Running">General Site Expense</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Description</label>
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
          className="w-full py-3 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Save Expense</span>
        </button>
      </form>
    </div>
  );
}

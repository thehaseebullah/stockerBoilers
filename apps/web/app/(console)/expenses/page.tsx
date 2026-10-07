"use client";

import { useState, useEffect } from "react";
import { DollarSign, Fuel, Search, Filter, Plus, X, CheckCircle2 } from "lucide-react";
import { DemoStore, DemoExpense, DemoBoiler } from "../../demo-store";

export default function ExpensesConsolePage() {
  const [expenses, setExpenses] = useState<DemoExpense[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Quick Log Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetBoilerId, setTargetBoilerId] = useState("");
  const [amount, setAmount] = useState("50.00");
  const [category, setCategory] = useState<DemoExpense["category"]>("Biomass Fuel");
  const [description, setDescription] = useState("");
  const [loggedBy, setLoggedBy] = useState("Operations Staff");

  const refresh = () => {
    setExpenses(DemoStore.getExpenses());
    setBoilers(DemoStore.getBoilers());
  };

  useEffect(() => {
    refresh();
    const unsub = DemoStore.subscribe(() => {
      refresh();
    });
    return () => unsub();
  }, []);

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.boilerModel.toLowerCase().includes(search.toLowerCase()) ||
      e.siteName.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.loggedBy.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
    return true;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const b = boilers.find((item) => item.id === (targetBoilerId || boilers[0]?.id));
    if (!b) return;

    DemoStore.addExpense({
      boilerId: b.id,
      boilerModel: b.model,
      siteName: b.siteName,
      amount: parseFloat(amount) || 0,
      category,
      description: description || `${category} refill`,
      loggedBy: loggedBy || "Site Operator",
    });

    setDescription("");
    setModalOpen(false);
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
            Boiler Running Expenses
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time feed of daily biomass fuel, water treatment chemicals, and maintenance costs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-semibold text-gray-400 block uppercase">Total Logged</span>
            <span className="text-lg font-extrabold text-[#FF6600]">${totalSpent.toFixed(2)}</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(255,102,0,0.25)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-5">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses by boiler, site, notes, operator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F3F4F7] text-xs rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none placeholder:text-gray-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 text-xs bg-[#F3F4F7] text-gray-700 rounded-xl border border-transparent focus:border-[#FF6600] focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Biomass Fuel">Biomass Fuel</option>
            <option value="Water Treatment">Water Treatment</option>
            <option value="Lubricants & Oils">Lubricants & Oils</option>
            <option value="Spare Parts">Spare Parts</option>
            <option value="Crew Allowance">Crew Allowance</option>
          </select>
        </div>

        {/* Expenses List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3 pl-3">Boiler & Site</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Logged By</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 pr-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 pl-3">
                    <span className="font-bold text-gray-900 block">{exp.boilerModel}</span>
                    <span className="text-[11px] text-gray-400 block">{exp.siteName}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-orange-50 text-[#FF6600] border border-orange-200">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="text-gray-700 block max-w-xs">{exp.description}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-medium text-gray-800">{exp.loggedBy}</span>
                  </td>
                  <td className="py-3.5 font-mono text-gray-400 text-[11px]">
                    {exp.date}
                  </td>
                  <td className="py-3.5 pr-3 text-right">
                    <span className="text-sm font-extrabold text-gray-900">${exp.amount.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-400">
              No matching expense records found.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: LOG EXPENSE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#FF6600]" />
                <h3 className="text-base font-bold text-gray-900">Record Boiler Expense</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Target Boiler</label>
                <select
                  value={targetBoilerId}
                  onChange={(e) => setTargetBoilerId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                >
                  <option value="Biomass Fuel">Biomass Fuel</option>
                  <option value="Water Treatment">Water Treatment</option>
                  <option value="Lubricants & Oils">Lubricants & Oils</option>
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Logged By</label>
                <input
                  type="text"
                  value={loggedBy}
                  onChange={(e) => setLoggedBy(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#FF6600] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-orange-600 rounded-xl shadow-xs"
                >
                  Save & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

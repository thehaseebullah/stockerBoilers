"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, DollarSign, LayoutDashboard, Home, ArrowLeft } from "lucide-react";

export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#F3F4F7] flex flex-col border-x border-gray-200 shadow-2xl relative">
      {/* Mobile Top App Bar */}
      <header className="h-16 border-b border-gray-200 bg-white/95 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20">
        <Link href="/f/home" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF6600] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(255,102,0,0.3)]">
            <Flame className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-gray-900">
              STOKER FIELD
            </div>
            <div className="text-[10px] text-gray-500 font-medium">Boiler Operator App</div>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#FF6600]" />
          <span>Console</span>
        </Link>
      </header>

      {/* Main Touch Canvas */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="h-16 border-t border-gray-200 bg-white fixed bottom-0 max-w-md w-full flex items-center justify-around text-xs font-medium z-20 px-4 shadow-lg">
        <Link
          href="/f/home"
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            pathname === "/f/home"
              ? "text-[#FF6600] font-bold"
              : "text-gray-400 hover:text-gray-900"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          href="/f/expenses"
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            pathname === "/f/expenses"
              ? "text-[#FF6600] font-bold"
              : "text-gray-400 hover:text-gray-900"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-[10px]">Log Expense</span>
        </Link>

        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-gray-400 hover:text-gray-900 transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Console</span>
        </Link>
      </nav>
    </div>
  );
}

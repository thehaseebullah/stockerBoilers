"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Users,
  Building2,
  Receipt,
  Smartphone,
  Search,
  Bell,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { DemoStore } from "../demo-store";
import { useState } from "react";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Boilers", icon: LayoutDashboard },
    { href: "/hr", label: "Staff & HRM", icon: Users },
    { href: "/sites", label: "Client Sites", icon: Building2 },
    { href: "/expenses", label: "Expenses", icon: Receipt },
    { href: "/simulator", label: "Mobile Simulation", icon: Smartphone },
  ];

  const handleReset = () => {
    setResetting(true);
    DemoStore.resetStore();
    setTimeout(() => setResetting(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F7] text-[#111827] flex flex-col antialiased">
      {/* Top Main Navigation Header matching reference image */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6600] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,102,0,0.35)] group-hover:scale-105 transition-transform duration-200">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <div className="font-extrabold text-lg tracking-tight font-[family-name:var(--font-display)] flex items-center gap-1.5 leading-none">
                  <span className="text-[#111827]">Stoker</span>
                  <span className="text-[#FF6600]">Boilers</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Industrial Steam Operations
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Sleek Pill Navigation Bar */}
          <nav className="hidden md:flex items-center bg-[#F3F4F7] p-1.5 rounded-full border border-gray-200 gap-1 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#181B20] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FF6600]" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Reset, Notification & User Avatar */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Reset Button */}
            <button
              onClick={handleReset}
              title="Reset Demo Data"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-200 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 text-[#FF6600] ${resetting ? "animate-spin" : ""}`} />
              <span>Reset Demo</span>
            </button>

            {/* Field App Shortcut */}
            <Link
              href="/f/home"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FF6600] bg-orange-50 hover:bg-orange-100 rounded-full border border-orange-200 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Field View</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6600] ring-2 ring-white" />
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-1 border-l border-gray-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Operations Director"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/20"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 leading-none">Operations Lead</span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">Demo Executive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto gap-1 pt-3 pb-1 border-t border-gray-100 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? "bg-[#181B20] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FF6600]" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

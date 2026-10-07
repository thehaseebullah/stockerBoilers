import Link from "next/link";
import { Flame, LayoutDashboard, Smartphone, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F3F4F7] text-[#111827] flex flex-col justify-between p-6 md:p-12">
      {/* Top Navigation */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6600] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,102,0,0.35)]">
            <Flame className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight font-[family-name:var(--font-display)]">
              STOKER <span className="text-[#FF6600]">BOILERS</span>
            </div>
            <div className="text-[10px] text-gray-500 font-medium">Operations Demo Suite</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Demo Ready • All Systems Active</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl w-full mx-auto my-12 space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-2xs text-xs font-semibold text-gray-700">
            <span className="w-2 h-2 rounded-full bg-[#FF6600]" />
            <span>Industrial Steam Operations • Facility Fleet Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-[family-name:var(--font-display)] text-gray-900 leading-tight">
            Industrial Boilers, <br className="hidden md:inline" />
            <span className="text-[#FF6600]">Managed With Certainty.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-normal">
            A purpose-built operations platform for tracking site boiler deployments, stationing operators, and logging daily running expenses with instant sync.
          </p>
        </div>

        {/* 3 Main Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Surface 1: Dashboard */}
          <Link
            href="/dashboard"
            className="group p-7 bg-white border border-gray-200 hover:border-[#FF6600] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6600] border border-orange-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-gray-900">
                  Boilers Dashboard
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6600] font-bold">
                  FLEET
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                4-column fleet view matching the reference design. Inspect site locations, view assigned operators, track daily running costs, and open detailed boiler drawers.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF6600] group-hover:translate-x-1 transition-transform">
              <span>Open Boilers Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Surface 2: HRM Staff */}
          <Link
            href="/hr"
            className="group p-7 bg-white border border-gray-200 hover:border-[#FF6600] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-gray-900">
                  Staff & HRM
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-600 font-bold">
                  HRM
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Full workforce console to add new staff, manage operators, assign technicians to specific boilers, and configure morning, evening, and night shifts.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
              <span>Manage Staff & Shifts</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Surface 3: Mobile Simulator */}
          <Link
            href="/simulator"
            className="group p-7 bg-white border border-gray-200 hover:border-[#FF6600] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-gray-900">
                  Mobile Simulation
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  MOBILE
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Interactive smartphone simulator where field operators log boiler running expenses with instant live sync back to the main console.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Launch Mobile Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto flex items-center justify-between text-xs text-gray-400 pt-8 border-t border-gray-200">
        <div>Stoker Boilers • Client Operations Demo</div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
          <Link href="/hr" className="hover:text-gray-900">Staff HRM</Link>
          <Link href="/simulator" className="hover:text-gray-900">Mobile Sim</Link>
          <Link href="/f/home" className="hover:text-gray-900">Field PWA</Link>
        </div>
      </footer>
    </main>
  );
}

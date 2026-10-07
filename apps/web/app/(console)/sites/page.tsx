"use client";

import { useState } from "react";
import { Building2, MapPin, Flame, Users, Plus, X, Search } from "lucide-react";
import { DemoStore } from "../../demo-store";

export default function SitesConsolePage() {
  const boilers = DemoStore.getBoilers();
  const staff = DemoStore.getStaff();
  const [search, setSearch] = useState("");

  const sites = [
    {
      id: "site-01",
      name: "Apex Textile Mills - Sector 4",
      client: "Apex Textiles Ltd",
      location: "Faisalabad Industrial Area, Site #04",
      boilerCount: boilers.filter((b) => b.siteName.includes("Apex")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Apex")).length || 3,
      status: "Active",
    },
    {
      id: "site-02",
      name: "GreenBio Bio-Refinery Unit 2",
      client: "GreenBio Chemical Plant",
      location: "Sheikhupura Road, Zone B, Lahore",
      boilerCount: boilers.filter((b) => b.siteName.includes("GreenBio")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("GreenBio")).length || 2,
      status: "Active",
    },
    {
      id: "site-03",
      name: "Prime Mills - Boiler Bay C",
      client: "Prime Sugar Refineries",
      location: "Sugar Mill Road, Multan",
      boilerCount: boilers.filter((b) => b.siteName.includes("Prime")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Prime")).length || 1,
      status: "Active",
    },
    {
      id: "site-04",
      name: "SunGlow Dairy & Beverage Plant",
      client: "SunGlow Food Processing",
      location: "Kot Lakhpat Industrial Estate, Lahore",
      boilerCount: boilers.filter((b) => b.siteName.includes("SunGlow")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("SunGlow")).length || 2,
      status: "Active",
    },
    {
      id: "site-05",
      name: "Crescent Mill Complex - Bay #1",
      client: "Crescent Paper Mills",
      location: "Gujranwala Road, Plant 1",
      boilerCount: boilers.filter((b) => b.siteName.includes("Crescent")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Crescent")).length || 1,
      status: "Standby",
    },
    {
      id: "site-06",
      name: "Indus Wet Processing Zone",
      client: "Indus Dyeing & Bleaching",
      location: "Nooriabad Industrial Estate, Sindh",
      boilerCount: boilers.filter((b) => b.siteName.includes("Indus")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Indus")).length || 2,
      status: "Active",
    },
  ];

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.client.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
            Client Facility Sites
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of industrial client sites hosting Stoker steam generator boilers.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[10px] font-semibold text-gray-400 block uppercase">Total Sites</span>
          <span className="text-lg font-extrabold text-gray-900">{sites.length} Active Locations</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility sites or clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F3F4F7] text-xs rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-[#F8F9FB] border border-gray-200/80 hover:border-orange-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ● {s.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 mt-3 leading-tight">{s.name}</h3>
                <span className="text-xs text-gray-500 font-medium block mt-0.5">{s.client}</span>

                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
                  <span className="truncate">{s.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1 text-gray-700">
                  <Flame className="w-3.5 h-3.5 text-[#FF6600]" />
                  <span>{s.boilerCount} Boiler Installed</span>
                </span>

                <span className="flex items-center gap-1 text-gray-700">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>{s.staffCount} Operators Stationed</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

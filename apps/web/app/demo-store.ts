"use client";

export interface DemoWorker {
  id: string;
  name: string;
  code: string;
  role: "Lead Boiler Operator" | "Biomass Fuel Feeder" | "Maintenance Specialist" | "Water Treatment Tech" | "Shift Supervisor";
  assignedBoilerId: string;
  assignedSite: string;
  shift: "Morning (06:00 - 14:00)" | "Evening (14:00 - 22:00)" | "Night (22:00 - 06:00)";
  status: "active" | "off_duty" | "on_leave";
  phone: string;
  avatar: string;
  dailyWage: string;
}

export interface DemoExpense {
  id: string;
  boilerId: string;
  boilerModel: string;
  siteName: string;
  amount: number;
  category: "Biomass Fuel" | "Water Treatment" | "Lubricants & Oils" | "Spare Parts" | "Crew Allowance" | "General Running";
  description: string;
  loggedBy: string;
  date: string;
  timestamp: string;
}

export interface DemoBoiler {
  id: string;
  code: string;
  model: string;
  clientName: string;
  siteName: string;
  siteLocation: string;
  image: string;
  status: "operational" | "maintenance" | "standby" | "issue";
  statusLabel: string;
  capacityKgPerHour: string;
  fuelType: string;
  installationDate: string;
  operatingHours: string;
  dailyRunningCost: number;
  leadOperatorName: string;
  lastUpdateMins: number;
  assignedWorkerIds: string[];
}

const INITIAL_BOILERS: DemoBoiler[] = [
  {
    id: "blr-01",
    code: "BLR-8456-VWK",
    model: "Thermax SteamMax 5T",
    clientName: "Apex Textiles Ltd",
    siteName: "Apex Textile Mills - Sector 4",
    siteLocation: "Faisalabad Industrial Area, Site #04",
    image: "/boilers/boiler_steammax.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "5,000 kg/hr",
    fuelType: "Biomass Briquettes (Cotton Stalk)",
    installationDate: "12 Feb 2024",
    operatingHours: "2,150 hrs",
    dailyRunningCost: 142.50,
    leadOperatorName: "Liam Harper",
    lastUpdateMins: 2,
    assignedWorkerIds: ["emp-01", "emp-02", "emp-05"],
  },
  {
    id: "blr-02",
    code: "BLR-5678-DEF",
    model: "Volta Steam G-5000",
    clientName: "GreenBio Chemical Plant",
    siteName: "GreenBio Bio-Refinery Unit 2",
    siteLocation: "Sheikhupura Road, Zone B, Lahore",
    image: "/boilers/boiler_watertube.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "8,500 kg/hr",
    fuelType: "Wood Pellets (Grade A)",
    installationDate: "20 May 2023",
    operatingHours: "4,320 hrs",
    dailyRunningCost: 210.00,
    leadOperatorName: "Noah Bennett",
    lastUpdateMins: 5,
    assignedWorkerIds: ["emp-03", "emp-04"],
  },
  {
    id: "blr-03",
    code: "BLR-2345-JKL",
    model: "Eco-Steam Pro 800kW",
    clientName: "Prime Sugar Refineries",
    siteName: "Prime Mills - Boiler Bay C",
    siteLocation: "Sugar Mill Road, Multan",
    image: "/boilers/boiler_biomass.jpg",
    status: "maintenance",
    statusLabel: "In Maintenance",
    capacityKgPerHour: "3,200 kg/hr",
    fuelType: "Bagasse & Agricultural Pellets",
    installationDate: "10 Oct 2023",
    operatingHours: "1,510 hrs",
    dailyRunningCost: 85.00,
    leadOperatorName: "Logan Pierce",
    lastUpdateMins: 1,
    assignedWorkerIds: ["emp-06"],
  },
  {
    id: "blr-04",
    code: "BLR-9101-GHI",
    model: "AquaSteam G-2500 Pack",
    clientName: "SunGlow Food Processing",
    siteName: "SunGlow Dairy & Beverage Plant",
    siteLocation: "Kot Lakhpat Industrial Estate, Lahore",
    image: "/boilers/boiler_ecopack.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "2,500 kg/hr",
    fuelType: "Agri-Biomass Pellets",
    installationDate: "05 Dec 2024",
    operatingHours: "845 hrs",
    dailyRunningCost: 95.00,
    leadOperatorName: "Mason Clarke",
    lastUpdateMins: 10,
    assignedWorkerIds: ["emp-07", "emp-08"],
  },
  {
    id: "blr-05",
    code: "BLR-6789-MNO",
    model: "Thermax SteamMax 8T Heavy",
    clientName: "Crescent Paper Mills",
    siteName: "Crescent Mill Complex - Bay #1",
    siteLocation: "Gujranwala Road, Plant 1",
    image: "/boilers/boiler_steammax.jpg",
    status: "standby",
    statusLabel: "Standby",
    capacityKgPerHour: "8,000 kg/hr",
    fuelType: "Rice Husk Pellets",
    installationDate: "18 Jan 2024",
    operatingHours: "3,120 hrs",
    dailyRunningCost: 45.00,
    leadOperatorName: "Lucas Reed",
    lastUpdateMins: 7,
    assignedWorkerIds: ["emp-09"],
  },
  {
    id: "blr-06",
    code: "BLR-7890-STU",
    model: "Volta Steam Industrial 600",
    clientName: "Indus Dyeing & Bleaching",
    siteName: "Indus Wet Processing Zone",
    siteLocation: "Nooriabad Industrial Estate, Sindh",
    image: "/boilers/boiler_watertube.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "6,200 kg/hr",
    fuelType: "Wood Chips & Sawdust Briquettes",
    installationDate: "15 Apr 2023",
    operatingHours: "5,400 hrs",
    dailyRunningCost: 178.00,
    leadOperatorName: "Elijah Brooks",
    lastUpdateMins: 4,
    assignedWorkerIds: ["emp-10", "emp-11"],
  },
  {
    id: "blr-07",
    code: "BLR-8901-YZA",
    model: "Eco-Steam High-Output 1200",
    clientName: "National Pharma Laboratories",
    siteName: "National Pharma Clean Steam Site",
    siteLocation: "Hub River Industrial Zone, Hub",
    image: "/boilers/boiler_biomass.jpg",
    status: "issue",
    statusLabel: "Issue Detected",
    capacityKgPerHour: "1,200 kg/hr",
    fuelType: "High Purity Wood Pellets",
    installationDate: "02 Aug 2024",
    operatingHours: "610 hrs",
    dailyRunningCost: 110.00,
    leadOperatorName: "Jameson Cole",
    lastUpdateMins: 8,
    assignedWorkerIds: ["emp-12"],
  },
  {
    id: "blr-08",
    code: "BLR-3456-PQR",
    model: "AquaSteam Rapid Steam 1500",
    clientName: "Sultan Leather Tanneries",
    siteName: "Sultan Tannery Boiler House",
    siteLocation: "Kasur Tanneries Zone, Kasur",
    image: "/boilers/boiler_ecopack.jpg",
    status: "maintenance",
    statusLabel: "In Maintenance",
    capacityKgPerHour: "1,500 kg/hr",
    fuelType: "Densified Biomass Pellets",
    installationDate: "29 Nov 2023",
    operatingHours: "2,890 hrs",
    dailyRunningCost: 65.00,
    leadOperatorName: "Oliver Hayes",
    lastUpdateMins: 3,
    assignedWorkerIds: ["emp-13", "emp-14"],
  },
];

const INITIAL_STAFF: DemoWorker[] = [
  {
    id: "emp-01",
    code: "EMP-101",
    name: "Liam Harper",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-01",
    assignedSite: "Apex Textile Mills - Sector 4",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 300 8472911",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$35.00",
  },
  {
    id: "emp-02",
    code: "EMP-102",
    name: "Ali Asghar",
    role: "Biomass Fuel Feeder",
    assignedBoilerId: "blr-01",
    assignedSite: "Apex Textile Mills - Sector 4",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 301 9876543",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$28.00",
  },
  {
    id: "emp-03",
    code: "EMP-103",
    name: "Noah Bennett",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-02",
    assignedSite: "GreenBio Bio-Refinery Unit 2",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 321 4455667",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$36.00",
  },
  {
    id: "emp-04",
    code: "EMP-104",
    name: "Zubair Khan",
    role: "Water Treatment Tech",
    assignedBoilerId: "blr-02",
    assignedSite: "GreenBio Bio-Refinery Unit 2",
    shift: "Evening (14:00 - 22:00)",
    status: "active",
    phone: "+92 333 5551212",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$32.00",
  },
  {
    id: "emp-05",
    code: "EMP-105",
    name: "Tariq Mahmood",
    role: "Shift Supervisor",
    assignedBoilerId: "blr-01",
    assignedSite: "Apex Textile Mills - Sector 4",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 300 1234567",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$45.00",
  },
  {
    id: "emp-06",
    code: "EMP-106",
    name: "Logan Pierce",
    role: "Maintenance Specialist",
    assignedBoilerId: "blr-03",
    assignedSite: "Prime Mills - Boiler Bay C",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 302 7788990",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$38.00",
  },
  {
    id: "emp-07",
    code: "EMP-107",
    name: "Mason Clarke",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-04",
    assignedSite: "SunGlow Dairy & Beverage Plant",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 306 1122334",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$34.00",
  },
  {
    id: "emp-08",
    code: "EMP-108",
    name: "Farhan Saeed",
    role: "Biomass Fuel Feeder",
    assignedBoilerId: "blr-04",
    assignedSite: "SunGlow Dairy & Beverage Plant",
    shift: "Evening (14:00 - 22:00)",
    status: "active",
    phone: "+92 307 4455889",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$28.00",
  },
  {
    id: "emp-09",
    code: "EMP-109",
    name: "Lucas Reed",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-05",
    assignedSite: "Crescent Mill Complex - Bay #1",
    shift: "Night (22:00 - 06:00)",
    status: "off_duty",
    phone: "+92 312 9988776",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$35.00",
  },
  {
    id: "emp-10",
    code: "EMP-110",
    name: "Elijah Brooks",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-06",
    assignedSite: "Indus Wet Processing Zone",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 314 5566778",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$36.00",
  },
  {
    id: "emp-11",
    code: "EMP-111",
    name: "Bilal Warraich",
    role: "Maintenance Specialist",
    assignedBoilerId: "blr-06",
    assignedSite: "Indus Wet Processing Zone",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 315 2233445",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$37.00",
  },
  {
    id: "emp-12",
    code: "EMP-112",
    name: "Jameson Cole",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-07",
    assignedSite: "National Pharma Clean Steam Site",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 316 8899001",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$35.00",
  },
  {
    id: "emp-13",
    code: "EMP-113",
    name: "Oliver Hayes",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-08",
    assignedSite: "Sultan Tannery Boiler House",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 318 4433221",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$34.00",
  },
  {
    id: "emp-14",
    code: "EMP-114",
    name: "Rashid Minhas",
    role: "Biomass Fuel Feeder",
    assignedBoilerId: "blr-08",
    assignedSite: "Sultan Tannery Boiler House",
    shift: "Evening (14:00 - 22:00)",
    status: "active",
    phone: "+92 319 6677889",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$28.00",
  },
];

const INITIAL_EXPENSES: DemoExpense[] = [
  {
    id: "exp-01",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 85.00,
    category: "Biomass Fuel",
    description: "Daily briquette loading top-up (2.5 tons batch)",
    loggedBy: "Liam Harper",
    date: "Today, 10:45 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-02",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 32.50,
    category: "Water Treatment",
    description: "Water softener conditioning additive",
    loggedBy: "Ali Asghar",
    date: "Today, 08:30 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-03",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 25.00,
    category: "Crew Allowance",
    description: "Morning boiler crew food & hydration stipend",
    loggedBy: "Tariq Mahmood",
    date: "Today, 07:15 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-04",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    amount: 140.00,
    category: "Biomass Fuel",
    description: "Wood pellets feed bin refilling",
    loggedBy: "Noah Bennett",
    date: "Today, 11:10 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-05",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    amount: 70.00,
    category: "Lubricants & Oils",
    description: "Feed auger high-temp synthetic gearbox oil",
    loggedBy: "Zubair Khan",
    date: "Today, 09:20 AM",
    timestamp: new Date().toISOString(),
  },
];

const STORAGE_KEYS = {
  BOILERS: "stoker_demo_boilers_v2",
  STAFF: "stoker_demo_staff_v2",
  EXPENSES: "stoker_demo_expenses_v2",
};

export const DemoStore = {
  getBoilers(): DemoBoiler[] {
    if (typeof window === "undefined") return INITIAL_BOILERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOILERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(INITIAL_BOILERS));
        return INITIAL_BOILERS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_BOILERS;
    }
  },

  getBoilerById(id: string): DemoBoiler | undefined {
    return this.getBoilers().find((b) => b.id === id);
  },

  updateBoilerStatus(id: string, status: DemoBoiler["status"]): void {
    if (typeof window === "undefined") return;
    const boilers = this.getBoilers();
    const updated = boilers.map((b) => {
      if (b.id === id) {
        let statusLabel = "Operational";
        if (status === "maintenance") statusLabel = "In Maintenance";
        if (status === "standby") statusLabel = "Standby";
        if (status === "issue") statusLabel = "Issue Detected";
        return { ...b, status, statusLabel, lastUpdateMins: 0 };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(updated));
    this.notify();
  },

  getStaff(): DemoWorker[] {
    if (typeof window === "undefined") return INITIAL_STAFF;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
        return INITIAL_STAFF;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_STAFF;
    }
  },

  getStaffForBoiler(boilerId: string): DemoWorker[] {
    return this.getStaff().filter((s) => s.assignedBoilerId === boilerId);
  },

  addStaff(worker: Omit<DemoWorker, "id" | "code">): DemoWorker {
    const current = this.getStaff();
    const nextCode = `EMP-${(current.length + 101).toString()}`;
    const newWorker: DemoWorker = {
      ...worker,
      id: `emp-${Date.now()}`,
      code: nextCode,
    };
    const updated = [newWorker, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(updated));
      // update boiler assignedWorkerIds
      const boilers = this.getBoilers();
      const updatedBoilers = boilers.map((b) => {
        if (b.id === worker.assignedBoilerId) {
          return {
            ...b,
            assignedWorkerIds: Array.from(new Set([...b.assignedWorkerIds, newWorker.id])),
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(updatedBoilers));
      this.notify();
    }
    return newWorker;
  },

  updateStaff(id: string, updates: Partial<DemoWorker>): void {
    if (typeof window === "undefined") return;
    const staff = this.getStaff();
    const updated = staff.map((s) => (s.id === id ? { ...s, ...updates } : s));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(updated));
    this.notify();
  },

  deleteStaff(id: string): void {
    if (typeof window === "undefined") return;
    const staff = this.getStaff().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));

    // Also remove from any boiler assignments
    const boilers = this.getBoilers().map((b) => ({
      ...b,
      assignedWorkerIds: b.assignedWorkerIds.filter((wid) => wid !== id),
    }));
    localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(boilers));
    this.notify();
  },

  getExpenses(): DemoExpense[] {
    if (typeof window === "undefined") return INITIAL_EXPENSES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
        return INITIAL_EXPENSES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_EXPENSES;
    }
  },

  getExpensesForBoiler(boilerId: string): DemoExpense[] {
    return this.getExpenses().filter((e) => e.boilerId === boilerId);
  },

  addExpense(expense: Omit<DemoExpense, "id" | "date" | "timestamp">): DemoExpense {
    const current = this.getExpenses();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newExpense: DemoExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
      date: `Today, ${timeStr}`,
      timestamp: now.toISOString(),
    };
    const updated = [newExpense, ...current];

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));

      // Automatically update the boiler's daily running cost!
      const boilers = this.getBoilers();
      const updatedBoilers = boilers.map((b) => {
        if (b.id === expense.boilerId) {
          return {
            ...b,
            dailyRunningCost: Number((b.dailyRunningCost + expense.amount).toFixed(2)),
            lastUpdateMins: 0,
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(updatedBoilers));
      this.notify();
    }
    return newExpense;
  },

  resetStore(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(INITIAL_BOILERS));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    this.notify();
  },

  notify(): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("stoker_demo_store_changed"));
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const handler = () => callback();
    window.addEventListener("stoker_demo_store_changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("stoker_demo_store_changed", handler);
      window.removeEventListener("storage", handler);
    };
  },
};

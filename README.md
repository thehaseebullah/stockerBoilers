# stockerBoilers — Industrial Steam & Boiler Operations Platform

A modern, high-performance web platform built for industrial steam-as-a-service and boiler facility operations. Designed to monitor facility boiler deployments, manage operator shifts, track daily running expenses, and simulate on-site field mobile reporting with instant live sync.

Inspired by modern fleet and asset tracking designs (FleetTrack style) with a clean light theme, vibrant orange accents, and responsive 4-column equipment cards.

---

## 🌟 Key Surfaces & Features

### 1. Boilers Fleet Dashboard (`/dashboard`)
- **FleetTrack Design Aesthetic:** Ultra-clean light-gray background (`#F3F4F7`), crisp white floating cards, and signature industrial orange (`#FF6600`) highlights.
- **Top 4 KPI Metrics:** Total Boilers, Active Operational Boilers, Units in Maintenance, and Inactive/Standby Boilers with live trend indicators.
- **4-Column Equipment Grid:** Displays boiler models, serial numbers, real-time status badges, lead operators, and timeline indicators.
- **Interactive Boiler Details Drawer:**
  - Operating site name and physical facility address.
  - Complete list of assigned operators with photos, roles, shift times, and duty status.
  - Running expenses breakdown with real-time totals.
  - Live status switcher (`Operational`, `Maintenance`, `Standby`, `Issue Detected`).
  - Direct actions to **Assign Staff** and **Log Running Expense**.

### 2. Staff & Workforce Management (`/hr`)
- Full employee registry and designation filter (`Lead Operators`, `Fuel Feeders`, `Maintenance Specialists`, `Water Treatment Techs`, `Shift Supervisors`).
- **Add New Staff Modal:** Register operators, specify shifts (`Morning`, `Evening`, `Night`), set daily wages, and assign directly to facility boilers.
- **Edit & Reassign Staff:** Real-time updates immediately reflected on the Boilers Dashboard and Boiler Details Drawer.

### 3. Employee Mobile Simulation (`/simulator`)
- Realistic smartphone device frame simulating the on-site operator's field experience.
- **Streamlined Workflow:** On-site worker selects their stationed boiler, enters the running expense (with one-tap presets for Fuel, Water Treatment, and Crew Allowance), and submits.
- **Instant Synchronization:** Updates the boiler's daily running cost and operations feed in real-time across the platform without page refreshes.

### 4. Client Facility Sites (`/sites`)
- Overview of industrial manufacturing plants hosting Stoker boilers with real-time boiler counts and stationed operator tallies.

### 5. Running Expenses Ledger (`/expenses`)
- Centralized log of fuel batches, water softening chemicals, lubricants, and spare parts with category filters and search.

---

## ⚡ Zero-Backend Client Demo Architecture

This project includes a built-in reactive client store (`apps/web/app/demo-store.ts`) utilizing local reactive state and browser storage.
- **No Database Hurdles:** Runs immediately without needing PostgreSQL, Redis, or external backend services.
- **Persistent Data:** Changes made in the UI (new staff, expenses, status changes) persist across page reloads.
- **Reset Button:** Use the **"Reset Demo"** button in the top navigation bar to reset all demo data back to default values at any time.

---

## 🚀 Local Development

1. Install dependencies:
   ```bash
   corepack enable
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

This repository is pre-configured for Vercel deployment with [vercel.json](file:///c:/Users/abcd/Downloads/BIOLERS/BIOLERS/vercel.json).

### Option A: Deploy from GitHub (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `thehaseebullah/stockerBoilers` repository.
4. **Vercel Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (Leave as root; `vercel.json` manages monorepo build)
   - **Build Command:** `pnpm --filter @stoker/web build`
   - **Output Directory:** `apps/web/.next`
   - **Install Command:** `pnpm install`
5. Click **Deploy**.

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

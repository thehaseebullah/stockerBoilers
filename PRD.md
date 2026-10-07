# Stoker — Product Requirements Document (PRD)

**Product:** Stoker Boilers Operations Platform  
**Status:** v2.0 (Executive Client Demo & Fleet Operations)  
**Target:** Client Showcase & Production Asset Management  
**Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Vercel Ready  

---

## 1. Executive Summary

Stoker Boilers is a dedicated operations and equipment management platform for an industrial steam and biofuel supply business. The platform monitors facility boiler deployments, organizes stationed workers and shift rosters, tracks daily running expenses (fuel, water treatment, lubricants), and enables field operators to log expenses with instant head office synchronization.

The platform provides a modern FleetTrack-inspired light UI designed for executive presentations and field operations.

---

## 2. Key Product Requirements

### 2.1 Fleet Boilers Dashboard (`/dashboard`)
- **REQ-BLR-01: Summary KPI Metrics:** 4 top stat cards displaying Total Boilers, Active Boilers, In Maintenance, and Inactive/Standby with visual trend pills.
- **REQ-BLR-02: 4-Column Card Grid:** High-resolution industrial boiler product renders on clean cards showing model, serial ID, status badge, stationed site, lead operator, and daily running cost.
- **REQ-BLR-03: Interactive Boiler Details Drawer:**
  - Clicking any boiler opens a detailed modal.
  - Displays site location, client, capacity, fuel type, operating hours.
  - Lists all assigned operators with avatars, designations, shifts, and duty status.
  - Lists today's running expenses with instant add actions.
  - Quick status switch buttons (`Operational`, `Maintenance`, `Standby`, `Issue Detected`).
- **REQ-BLR-04: Streamlined Operational Metrics:** Complex thermodynamic engineering metrics (pressure gauges, PSI/bar dials, heat telemetry) are removed in favor of clean operational metrics (Site Location, Assigned Workers, Running Expenses, Operating Hours).

### 2.2 Workforce & HRM Console (`/hr`)
- **REQ-HR-01: Staff Roster:** Complete registry of operators, fuel feeders, maintenance specialists, water technicians, and supervisors.
- **REQ-HR-02: Boiler Assignment:** Every staff member is stationed at a specific boiler unit and site.
- **REQ-HR-03: Add & Edit Staff:** Interactive modal to register new personnel, set shift schedules (`Morning`, `Evening`, `Night`), configure daily wages, and reassign locations.
- **REQ-HR-04: Real-time Sync:** Staff updates made in HRM immediately reflect in the Boilers Dashboard and Boiler Details Drawer.

### 2.3 Mobile Field Simulation (`/simulator`)
- **REQ-SIM-01: Smartphone Shell:** Mobile device frame simulating the on-site operator's phone.
- **REQ-SIM-02: Focused Expense Entry:** On-site operator selects their stationed boiler and logs running expenses with one-tap presets (+$85 Fuel, +$35 Water, +$25 Crew).
- **REQ-SIM-03: Instant Sync:** Submitting an expense updates the boiler's running cost and recent expenses stream in real-time across the platform without page refreshes.

### 2.4 Client Demo & Hosting Architecture
- **REQ-DEMO-01: Zero Database Dependency:** Fully standalone reactive demo store (`demo-store.ts`) with browser persistence and reset capabilities.
- **REQ-DEMO-02: Vercel Ready:** Pre-configured `vercel.json` ensuring 1-click cloud deployment.

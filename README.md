# stockerBoilers

Industrial Steam & Boiler Operations Demo Suite.

A modern operations platform designed to monitor boiler deployments, station operators, track running expenses, and simulate on-site field reporting with instant live sync.

## ✨ Features

- **Fleet Dashboard (`/dashboard`)**:
  - Light-mode design inspired by FleetTrack.
  - 4 Summary KPI cards: Total Boilers, Active Boilers, In Maintenance, and Inactive/Standby.
  - 4-Column responsive boiler grid featuring custom industrial boiler product renders.
  - Interactive Boiler Drawer: Detailed site location, assigned operators, shift schedules, running expenses, and status toggles.
- **Staff & Workforce Management (`/hr`)**:
  - Full employee roster with designation filters (Lead Operators, Biomass Feeders, Maintenance Specialists, Water Treatment Techs, Supervisors).
  - Add, edit, and reassign staff to specific boilers and sites.
  - Shifts, attendance status, and wage tracking.
- **Mobile Employee Simulator (`/simulator`)**:
  - Realistic smartphone UI demonstrating on-site operator workflows.
  - Log boiler running expenses with instant, live synchronization to the head office console.
- **Field Operations App (`/f/home`)**:
  - Mobile-first field portal for logging expenses on the go.

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the local development server:
   ```bash
   pnpm dev
   ```

3. Open in your browser:
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Staff HRM: [http://localhost:3000/hr](http://localhost:3000/hr)
   - Mobile Simulation: [http://localhost:3000/simulator](http://localhost:3000/simulator)

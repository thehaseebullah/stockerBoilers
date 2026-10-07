# Stoker — Master Prompt for the Coding Agent

> **For the human, before you start:**
> 1. Create the repo and put the spec files in `docs/`: `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
> 2. The project features a modern FleetTrack-inspired light UI with industrial orange accents (`#FF6600`).
> 3. Zero-backend client demo mode is enabled via `apps/web/app/demo-store.ts` for instant Vercel cloud deployment.
> 4. Deployable to Vercel via the root `vercel.json` configuration.

---

## 1. Who you are and what you're building

You are the lead engineer building **Stoker Boilers**, an operations platform for a company that deploys boilers to client sites, staffs those sites with trained operators, and supplies them with biofuel.

Stoker has primary surfaces in one Next.js app:

- **Console (`/dashboard`)** — Head-office fleet operations console: 4-column boiler cards, client site assignments, detailed equipment drawers, running costs, and live status toggles.
- **Staff & HRM (`/hr`)** — Workforce console: employee registry, role filters, add/edit staff modals, shift rosters (Morning, Evening, Night), and site boiler assignments.
- **Mobile Simulator (`/simulator`)** — Smartphone frame simulating the on-site operator's phone to log boiler running expenses with real-time sync back to the console.
- **Field Web App (`/f/home`)** — Mobile touch-friendly portal for on-site personnel.
- **Client Sites (`/sites`)** — Industrial client manufacturing facilities hosting boiler equipment.
- **Expenses (`/expenses`)** — Centralized running expenses and consumables log.

## 2. Your sources of truth

Three core documents in `docs/` define the product:

| File | Answers |
|---|---|
| `docs/PRD.md` | **What** to build: operational requirements, user roles, core workflows, demo mode specifications |
| `docs/ARCHITECTURE.md` | **How** to build it: monorepo layout, Next.js App Router, demo store, Vercel deployment |
| `docs/DESIGN.md` | **How it looks**: FleetTrack light design system, color tokens, 4-column cards, interactive modals |
| `docs/DECISIONS.md` | **Why**: Architecture Decision Records (ADRs) |
| `docs/PROGRESS.md` | **Status**: Milestone tracking and delivery log |

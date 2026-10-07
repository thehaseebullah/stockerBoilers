# Stoker — Architecture

**Companion to:** `PRD.md`, `DESIGN.md`  
**Status:** v2.0 (Executive Client Demo & Production Architecture)  
**Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Turborepo · Drizzle ORM / Demo Store  

---

## 1. Architectural Overview & Deployment Modes

Stoker supports two primary operational topologies:

```mermaid
flowchart TD
  subgraph Client Demo Mode [Active Client Demo Mode — Vercel Ready]
    UI[Next.js 15 App Router<br/>/dashboard, /hr, /simulator, /f/home]
    DS[Reactive Demo Store<br/>apps/web/app/demo-store.ts]
    LS[(Browser LocalStorage & Event Bus)]
    UI <--> DS
    DS <--> LS
  end

  subgraph Production Enterprise Mode [Enterprise Backend Infrastructure]
    API[/api/v1 Command & Query Endpoints]
    CMD[Transactional runCommand Runner]
    DORM[Drizzle ORM Engine]
    PG[(PostgreSQL 16 Multi-tenant DB)]
    OUTBOX[(Transactional Outbox: domain_events)]
    S3[(Object Storage: MinIO / S3)]
    API --> CMD --> DORM --> PG
    CMD --> OUTBOX
  end
```

### Mode 1: Executive Client Demo Mode (Vercel Ready)
- **Zero External Dependencies:** Runs anywhere without requiring PostgreSQL, Redis, or Docker daemon.
- **Instant Reactive Sync:** Implemented via `apps/web/app/demo-store.ts`. When an expense is recorded in the mobile simulation, it updates the central dashboard and boiler drawers in real-time.
- **Client Persistence:** Retains demo data across browser refreshes via `localStorage` with a 1-click **Reset Demo** action.
- **Vercel Optimized:** Configured with `vercel.json` and Next.js Turbopack build rules.

### Mode 2: Enterprise Backend Mode
- Transactional command runner `runCommand()` wrapping Drizzle database mutations.
- Strict site scoping, audit logging (`audit_log`), and idempotent command processing (`processed_commands`).
- Double-entry balanced journal posting engine (`sum(debits) === sum(credits)`).

---

## 2. Monorepo Structure

```
BIOLERS/
├── apps/
│   └── web/                   # Next.js 15 App Router web application
│       ├── app/
│       │   ├── (console)/     # Head office console (Dashboard, HR, Sites, Expenses)
│       │   ├── (field)/       # Mobile Field PWA (/f/home, /f/expenses)
│       │   ├── simulator/     # Mobile Employee Simulator
│       │   └── demo-store.ts  # Central reactive demo store
│       └── public/boilers/    # High-resolution boiler renders
├── packages/
│   ├── config/                # Shared ESLint, Prettier, TypeScript configs
│   ├── contracts/             # Zod validation schemas & command definitions
│   ├── db/                    # Drizzle ORM schema, migrations, and seeds
│   ├── domain/                # Business logic, command runners, ledgers
│   ├── field-sync/            # Offline-first IndexedDB queue and dispatcher
│   ├── simulator/             # Simulation flow definitions
│   └── ui/                    # Design system components
├── vercel.json                # Vercel deployment configuration
├── turbo.json                 # Turborepo task pipeline
└── package.json               # Root workspace manifest (pnpm)
```

---

## 3. Vercel Deployment Architecture

The root `vercel.json` defines monorepo build behavior for Vercel:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm --filter @stoker/web build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install"
}
```

- **Output:** Fully pre-rendered static routes with instant edge delivery.
- **Build Verification:** Tested with `pnpm --filter @stoker/web build`, verifying all 27 routes compile cleanly with zero TypeScript errors.

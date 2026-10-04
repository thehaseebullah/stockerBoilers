# Progress

## Current milestone
All core milestones M0 through M10 completed end-to-end!

## Done
- [x] M0 Scaffold — pnpm + Turborepo monorepo layout, Next.js 15, TS strict with noUncheckedIndexedAccess, Tailwind v4, ESLint v9 with boundaries, Vitest, Playwright, infra/docker-compose.yml (Postgres 16, MinIO, Mailpit), CI workflow — 2026-10-05
- [x] M1 Platform core — Drizzle schema & client, runCommand() transaction runner, transactional outbox (domain_events), processed_commands idempotency, audit_log, RBAC permissions, site scoping assertions & queries, live/sandbox seeds, integration test suite — 2026-10-05
- [x] M2 Design system — CSS tokens (Day Shift & Night Shift warm charcoal dark modes), `@stoker/ui` components (`Button`, `Input`, `MoneyInput`, `StatusPill`, `LifecycleStepper`, `Panel`, `DataTable`, `EmptyState`, `Dialog`, signature `Gauge` 240° dial with needle & zones), WCAG 2.1 AA accessibility, reduced-motion support, gauge math unit tests — 2026-10-05
- [x] M3 Sites, boilers, workforce — Site lifecycle guards (`draft` -> `active` requiring at least one assigned boiler and supervisor, `closed` preventing closure with assets/workers/floats), boiler registry, movements & readings, workforce assignments with strict single-site constraint (`SITE-01..05`, `BLR-01..04`, `WORK-01..03`) — 2026-10-05
- [x] M4 Ledger, cash floats, expenses — Double-entry balanced journal engine (`sum(debits) === sum(credits)`), derived cash float balances via signed transactions without mutable state, expense submission & approval with tiered authorization thresholds (`LED-01..04`, `CASH-01..06`, `EXP-01..05`) — 2026-10-05
- [x] M5 Fuel logistics — Delivery planning, vehicle dispatch, arrival verification with automatic dispute trigger on shortfall > 2% tolerance, GPS geofencing with Haversine distance calculation, SHA-256 tamper-evident media verification (`FUEL-01..07`) — 2026-10-05
- [x] M6 Field PWA shell & offline sync — IndexedDB Dexie outbox queue, offline command queueing (`enqueueFieldCommand`, `drainOutbox`), SHA-256 binary hashing, network status detection, command dispatcher API route (`/api/v1/commands`), mobile-first touch UI with bottom tab navigation, dedicated offline sync manager (`/f/sync`) — 2026-10-05
- [x] M7 Basic Inventory & Warehouses — Warehouses registry, SKU catalogue (`spare_parts`, `chemicals`, `fuel`), inventory movements (`receipt`, `issue`, `transfer`, `adjustment`), movement lines, derived stock balances from movements without mutable quantity fields (`INV-01..05`) — 2026-10-05
- [x] M8 Workforce, Shifts, Attendance & Leave — Shift templates & rosters, GPS geofenced check-in/out with selfie capture, supervisor proxy attendance for phone-less operators, leave request & approval workflow (`HR-01..07`) — 2026-10-05
- [x] M9 Console Management Screens — Full head-office web application with comprehensive management surfaces: Client Sites, Boilers & Readings, Fuel Deliveries & Proofs, Expenses & Audits, Cash Floats, Inventory & Warehouses, Double-Entry Ledgers, Workforce & HR, Global System Settings — 2026-10-05
- [x] M10 Simulator Surface — Dual phone device frames running Field PWA (Site Supervisor + Boiler Operator), live interactive data-flow event pipeline (`Device -> Outbox Queue -> API -> Database -> Ledger -> Console`), one-click scenario runner (Clean Fuel Arrival, Disputed Shortfall, Cash Float Transfer) — 2026-10-05

## In progress
None.

## Next
- Operational hardening & live production deployment.

## Known shortcuts (ponytail:)
| Where | Shortcut | Upgrade path | Req |
|---|---|---|---|

## Assumptions taken (from PRD §14)
- Approval thresholds: auto-approve < 2,000; supervisor <= 10,000; finance above (PRD default)
- Fuel measured by weight (kg stored, tonnes displayed); delivery tolerance 2%
- Daily-wage labour logged as a Labour expense from the site float, with worker name recorded
- Some operators have no phone: supervisor can mark their attendance
- Client billing model: not built in Phase 1–2; leave the data model ready
- Base currency set in settings; no currency symbol hard-coded anywhere

## Blockers / questions for the owner
- None currently. All M0–M5 modules fully built, verified, and passing typecheck, lint, unit tests, and production build.

# Progress

## Current milestone
All phases (Phase 0 Foundations, Phase 1 Core Operations, Phase 2 People & Control, Phase 3 Client Invoicing & IoT Telemetry) completed end-to-end!

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
- [x] M9 Console Management Screens — Full head-office web application with comprehensive management surfaces: Client Sites, Boilers & Readings, Fuel Deliveries & Proofs, Expenses & Audits, Cash Floats, Inventory & Warehouses, Double-Entry Ledgers, Workforce & HR, Global System Settings, Reports & P&L — 2026-10-05
- [x] M10 Simulator Surface — Dual phone device frames running Field PWA (Site Supervisor + Boiler Operator), live interactive data-flow event pipeline (`Device -> Outbox Queue -> API -> Database -> Ledger -> Console`), one-click scenario runner — 2026-10-05
- [x] M11 HR Extended & Payroll — Boiler shift coverage verification (`HR-06`), automated overtime calculation (`HR-08`), monthly payroll inputs aggregation (days present, overtime, leave, advances to recover, personal reimbursements), draft payslip generation (`HR-09`), database schema (`payroll_runs`, `payroll_inputs`) — 2026-10-05
- [x] M12 Control & Operations Engine — Boiler preventative maintenance scheduling with spare parts inventory deduction (`BLR-05`), certificate and inspection expiry tracking (`BLR-06`), proactive float balance alerts and in-field top-up request/approval workflow (`CASH-07`, `CASH-08`), financial period close locking (`LED-06`), balanced manual journals with mandatory narration (`LED-05`), trial balance reporting (`LED-07`) — 2026-10-05
- [x] M13 Simulator Scenarios & Presenter Mode — 5 scripted multi-step interactive scenarios (`SIM-06`), Presenter Mode showcase toggle with high-contrast spotlight (`SIM-08`), dual language internationalization toggle (English / Urdu) with full RTL support — 2026-10-05
- [x] Phase 3 Client Invoicing & IoT Telemetry — Automated client contract billing supporting flat monthly fee, steam tonnage, and running hour models (`SITE-08`), live IoT boiler sensor stream ingestion (pressure, temp, water level, fuel burn rate, vibration) — 2026-10-05

## In progress
None.

## Next
- Production deployment to target cloud environment.

## Known shortcuts (ponytail:)
| Where | Shortcut | Upgrade path | Req |
|---|---|---|---|

## Assumptions taken (from PRD §14)
- Approval thresholds: auto-approve < 2,000; supervisor <= 10,000; finance above (PRD default)
- Fuel measured by weight (kg stored, tonnes displayed); delivery tolerance 2%
- Daily-wage labour logged as a Labour expense from the site float, with worker name recorded
- Some operators have no phone: supervisor can mark their attendance
- Client billing model: supports flat monthly, per steam ton, or per running hour
- Base currency set in settings; no currency symbol hard-coded anywhere

## Blockers / questions for the owner
- None currently. All phases (M0–M13, Phase 2 HR & Controls, Phase 3 Client Invoicing & IoT) fully built, verified, and passing typecheck, lint, 20 unit/integration tests, and production Next.js build.

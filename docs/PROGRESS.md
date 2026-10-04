# Progress

## Current milestone
M2 — Design system (next)

## Done
- [x] M0 Scaffold — pnpm + Turborepo monorepo layout, Next.js 15, TS strict with noUncheckedIndexedAccess, Tailwind v4, ESLint v9 with boundaries, Vitest, Playwright, infra/docker-compose.yml (Postgres 16, MinIO, Mailpit), CI workflow — 2026-10-05
- [x] M1 Platform core — Drizzle schema & client, runCommand() transaction runner, transactional outbox (domain_events), processed_commands idempotency, audit_log, RBAC permissions, site scoping assertions & queries, live/sandbox seeds, integration test suite — 2026-10-05

## In progress

## Next
- M2 Design system (`packages/ui` tokens from DESIGN §14.1, Day/Night shift themes, AppShell, Sidebar, TopBar, PageHeader, Tabs, Panel, Button, MoneyInput, StatusPill, LifecycleStepper, DataTable, EmptyState, Toast, Dialog, CommandPalette, Gauge 240° dial)

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
- None currently.

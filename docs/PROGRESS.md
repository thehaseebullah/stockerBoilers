# Progress

## Current milestone
M1 — Platform core (next)

## Done
- [x] M0 Scaffold — pnpm + Turborepo monorepo layout, Next.js 15, TS strict with noUncheckedIndexedAccess, Tailwind v4, ESLint v9 with boundaries, Vitest, Playwright, infra/docker-compose.yml (Postgres 16, MinIO, Mailpit), CI workflow — 2026-10-05

## In progress

## Next
- M1 Platform core (Drizzle setup + migrations, domain/shared, runCommand(), domain_events + outbox + processed_commands, audit log, Better Auth, roles/permissions, site scoping, RLS, seed + sandbox seed)

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

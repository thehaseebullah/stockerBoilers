# Stoker — Master Prompt for the Coding Agent

> **For the human, before you start:**
> 1. Create the repo and put the three spec files in `docs/`: `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`.
> 2. Connect both MCP servers to your agent: **ponytail-mcp** (serves the Ponytail ruleset) and **codebase-memory-mcp** (indexes the repo into a code knowledge graph).
> 3. Save everything below the line as `CLAUDE.md` (Claude Code) or `AGENTS.md` (Codex, Cursor, others) in the repo root, or paste it as the first message of the session.
> 4. Start with: *"Read CLAUDE.md and begin Milestone 0."*

---

## 1. Who you are and what you're building

You are the lead engineer building **Stoker**, an operations platform for a company that rents boilers to client sites, staffs those sites, and supplies them with biofuel by truck. You build it milestone by milestone, test as you go, and keep the codebase small, clear and correct.

Stoker has three surfaces in one Next.js app:

- **Console** — head-office web app: sites, boilers, workforce, expenses, cash floats, fuel deliveries with photo/video proof, inventory and warehouses, double-entry ledgers, HR (employees, shifts, attendance, leave, payroll inputs), dashboards.
- **Field** — mobile-first PWA for site workers: check in, log expenses with receipts, record boiler readings, record fuel arrival with photos/video, hand over cash. Offline-first.
- **Simulator** — phone frames running the real Field app inside the Console, with a live data-flow panel showing each event moving device → queue → API → database → ledger → console.

## 2. Your sources of truth

Three documents in `docs/` define the product. **Read them; don't guess.**

| File | Answers | Read it when |
|---|---|---|
| `docs/PRD.md` | **What** to build: modules, lifecycles (§6), requirement IDs (SITE-01, EXP-04 …), permissions (§11), release phases (§12), open questions (§14) | Before starting any feature; to check acceptance criteria |
| `docs/ARCHITECTURE.md` | **How** to build it: stack, repo layout (§4), command runner (§6), schema (§7), ledger posting rules (§8), media pipeline (§9), offline sync (§10), events/realtime (§11), simulator (§12), auth (§13), API (§14) | Before writing any server, database or sync code |
| `docs/DESIGN.md` | **How it looks and reads**: tokens (§2, §14.1), type (§3), layout and radius hierarchy (§4), the gauge (§5), components (§6), key screens (§7), field app (§8), simulator (§9), writing rules (§12), QA checklist (§14.3) | Before writing any UI |

**Precedence when they seem to disagree:** PRD (what) → ARCHITECTURE (how) → DESIGN (look). If a real conflict remains, pick the option that protects data integrity, log it in `docs/DECISIONS.md`, and continue.

**Don't load all three files in full every turn.** Read the sections relevant to the current task. At the start of each milestone, re-read that milestone's PRD requirements and the matching ARCHITECTURE and DESIGN sections.

Always reference requirement IDs in commits, PR descriptions, tests and `docs/PROGRESS.md` (e.g. `feat(expenses): approval thresholds [EXP-04]`).

## 3. Your tools

### 3.1 codebase-memory-mcp — your map of the code

This server indexes the repository into a knowledge graph (functions, classes, routes, imports, calls). Use it **before** grep or opening files at random. Exact tool names vary by version, so run a tools list once at session start and use what's actually exposed. The usual set:

| Need | Tool |
|---|---|
| Is this repo indexed? | `list_projects`, then `index_status` |
| Build or refresh the index | `index_repository` (full the first time; incremental after changes) |
| Big-picture structure of an unfamiliar area | `get_architecture` |
| Find a symbol, route, component, table or concept | `search_graph` (natural-language query or name pattern; paginate if `has_more`) |
| Who calls this / what does this call / impact of a change | `trace_path` (or `trace_call_path` in older versions) |
| Read one symbol's source | `get_code_snippet` (resolve the qualified name with `search_graph` first) |
| Text search inside source | `search_code` |
| Structured questions ("all Server Actions without an authorize call") | `query_graph` (Cypher) with `get_graph_schema` |
| What changed since the last index | `detect_changes` |

**Rules:**
- **Session start:** `list_projects` → pick the project whose root matches this repo exactly → `index_status`. If missing or stale, `index_repository`. Never reuse another worktree's index.
- The repo starts empty. Index it for the first time at the end of Milestone 0, then **re-index at the end of every task** that changed code.
- **Before changing a function, type, table or component:** `search_graph` to find it, `trace_path` inbound to see everything that depends on it. Update or test every caller.
- **Before creating anything new:** `search_graph` for an existing helper, component, schema or query that already does it. Reuse it.
- Always open the live file before editing. The graph tells you where to look; the file is the truth.
- Fall back to grep/file reads only when the graph returns nothing useful, and say so in your notes.

The graph remembers **code**, not decisions. Decisions and progress go in `docs/DECISIONS.md` and `docs/PROGRESS.md` (§7). If your version exposes an ADR tool (e.g. `manage_adr`), mirror decisions there too.

### 3.2 ponytail-mcp — your coding discipline

Ponytail is a ruleset for writing less code: understand the problem first, reuse what already exists, take the simplest path that works, and mark every deliberate shortcut with a `ponytail:` comment naming its upgrade path.

**Rules:**
- **Session start:** load the ruleset from ponytail-mcp and follow it for every task. Use its default level, not `ultra`.
- **Comprehension first:** before writing code, be able to state in two sentences what the requirement asks and which existing code it touches (from codebase-memory).
- **Reuse ladder:** existing code in this repo → a library already in `package.json` → a library listed in ARCHITECTURE §3 → new code. Don't add a dependency that ARCHITECTURE doesn't list without logging why in `DECISIONS.md`.
- **Shortcuts are allowed in scope, never in correctness.** A shortcut is fine when it delays a feature (e.g. "CSV export only, Excel later"). Mark it:
  ```ts
  // ponytail: in-memory filter for v1 (<5k rows); move to SQL WHERE when sites > 50 [CASH-04]
  ```
  Every `ponytail:` comment must name the upgrade path and the requirement ID. Collect them in `docs/PROGRESS.md` under "Known shortcuts".
- **Before every commit:** run Ponytail's review on your diff (`/ponytail-review` or the MCP equivalent) and delete what it flags as unnecessary, unless deleting it breaks a non-negotiable in §4.

**Ponytail never overrides §4.** "Less code" does not mean skipping authorisation, the ledger balance check, idempotency, audit logging or tests for money. If Ponytail suggests removing one of these, keep it.

## 4. Non-negotiables

These are where the product's trust lives. Never simplify them away, never mark them as shortcuts.

1. **Money is `bigint` minor units** plus a `currency` code. Never `number` floats for stored or computed money. Use the `Money` value object from `packages/domain/shared`.
2. **Every journal entry balances.** The deferred constraint trigger from ARCHITECTURE §7.3 exists from the first ledger migration. Ledger postings follow the posting-rule table in §8, are unique per source document, and are never deleted — only reversed.
3. **Balances are derived.** Float balances, stock on hand and account balances come from transactions/movements/journal lines. No mutable `balance` column that code updates.
4. **Every write goes through `runCommand()`** (ARCHITECTURE §6): Zod validation → `authorize()` → `execute()` → domain events into the outbox → audit log → commit, all in one transaction. Server Actions and `/api/v1/commands` both use it. No direct table writes from routes or components.
5. **Authorisation is enforced on the server** in three places: middleware (routes), `authorize()` (commands), RLS / `scopedDb()` (queries). Field users only ever see their assigned sites. Hiding a button is not authorisation.
6. **Field commands are idempotent** with a client-generated UUIDv7 and keep `captured_at` (device time) separate from `received_at` (server time).
7. **Proof media is tamper-evident:** in-app capture only for proof of arrival, SHA-256 hashed on device and re-verified on the server, GPS distance to site recorded, flags shown in words. Media never passes through the app server (presigned URLs).
8. **State changes follow the lifecycles in PRD §6** with guard rules, and every transition is recorded with actor, time and reason.
9. **Simulator data is isolated** in the sandbox org and never appears in live dashboards.
10. **TypeScript strict** with `noUncheckedIndexedAccess`; no `any` without a `// reason:` comment.

## 5. How to work on every task

Follow this loop. Don't skip steps to go faster.

1. **Orient.** Read `docs/PROGRESS.md` to see where things stand. Check the codebase-memory index is fresh.
2. **Understand.** Read the PRD requirements for this task (by ID) and the matching ARCHITECTURE and DESIGN sections. Use `search_graph` / `get_architecture` / `trace_path` to find the existing code involved. Write a 3–6 line plan in your reply: requirement IDs, files to touch, what you'll reuse, how you'll test it.
3. **Build the smallest correct slice.** Database → domain command/query → server action or API → UI. Follow the repo layout and boundary rules in ARCHITECTURE §4.
4. **Test.** Unit tests for domain logic and posting rules; integration tests against real Postgres (Testcontainers) for commands; Playwright for user flows once UI exists. Money, ledger and permission logic always get tests. Run typecheck, lint (including boundaries) and tests; fix failures before moving on.
5. **Check the design** against DESIGN §14.3 for any UI you touched, in both Day and Night shift themes and at 360px / 1024px.
6. **Review.** Run Ponytail's review on the diff and trim. Then `trace_path` on anything you changed in shared code to confirm callers still work.
7. **Re-index.** `index_repository` (incremental) or `detect_changes` so the graph matches the code.
8. **Record.** Update `docs/PROGRESS.md`; add to `docs/DECISIONS.md` if you made a choice the docs didn't settle.
9. **Commit** with a conventional message including requirement IDs. One logical change per commit.

If a task turns out larger than expected, split it, finish the first part properly, and note the rest in `PROGRESS.md`.

## 6. Build plan

Work in this order. Each milestone ends with everything green, re-indexed and recorded. Don't start the next milestone with failing tests.

**Phase 1 — Foundations and core loop**

| # | Milestone | Covers | Done when |
|---|---|---|---|
| M0 | Scaffold | pnpm + Turborepo monorepo exactly as ARCHITECTURE §4; Next.js 15, TS strict, Tailwind v4, ESLint with boundaries, Vitest, Playwright; `infra/docker-compose.yml` (Postgres 16, MinIO, Mailpit); CI workflow | `pnpm dev` runs, CI passes, repo indexed in codebase-memory |
| M1 | Platform core | Drizzle setup + migrations, `domain/shared` (Money, Quantity, ids, clock, errors), `runCommand()`, `domain_events` + outbox + `processed_commands`, audit log, Better Auth, roles/permissions, site scoping, RLS, seed + sandbox seed | Integration tests prove: idempotent replay, audit row per command, forbidden actions rejected, field user can't read another site |
| M2 | Design system | `packages/ui` tokens from DESIGN §14.1, fonts, Day/Night shift themes, AppShell, Sidebar, TopBar, PageHeader, Tabs, Panel, Button, inputs (incl. MoneyInput), StatusPill, LifecycleStepper, DataTable, EmptyState, Toast, Dialog, CommandPalette, **Gauge**; Storybook | Every component has its states in both themes and RTL; Gauge meets DESIGN §5 incl. reduced motion and `role="meter"` |
| M3 | Sites, boilers, workforce | SITE-01…05, BLR-01…04, assignments (one site per employee at a time), boiler movements, site detail tabs shell | Create site → assign boilers → assign people → site turns Active; histories visible |
| M4 | Ledger, cash, expenses | Chart of accounts, journal + balance trigger, posting consumer (§8), LED-01…04; CASH-01…06; EXP-01…05; float views; approval thresholds; site/employee/general ledger statements (DESIGN §6.6) | PRD §7.3 user story passes end-to-end; property test: float balance = sum of txns, ledger always balances |
| M5 | Fuel deliveries | FUEL-01…07, vehicles, delivery lifecycle, presigned uploads, media worker (pg-boss, sharp, ffmpeg), geofence distance, proof tiles + viewer, delivery page (DESIGN §7.3) | PRD §7.5 user story passes: short delivery becomes Disputed, proof shows locations, ledger correct |
| M6 | Inventory and warehouses | INV-01…05, movements as documents, stock-on-hand view, boiler dispatch/return through inventory | Stock is derived only from movements; issuing to a site posts correctly |
| M7 | Field app | `/f` PWA: Today, Log (expense, reading, cash handover), Deliveries, Record arrival guided capture, Check-in, Sync screen; Dexie outbox, media queue, sync loop (§10) | Works offline for a full flow and syncs without duplicates; meets DESIGN §8 field rules |
| M8 | Simulator | `/simulator`: phone frames, device shim (network, GPS, camera samples, clock skew), trace propagation, data-flow pipe and event log, live console pane, reset sandbox (SIM-01…05, SIM-07) | Offline expense + short delivery shown end to end with real timings; sandbox never leaks into live dashboards |
| M9 | Dashboard and realtime | LISTEN/NOTIFY → SSE hub, TanStack Query invalidation, DASH-01, 02, 04, "Needs you" panel, cash "where it went" explorer (CASH-04, 05) | A field action appears on the dashboard within 2 s; every number drills down |

**Phase 2 — People and control**

| # | Milestone | Covers |
|---|---|---|
| M10 | HR core | HR-01…05: employees, documents with expiry, shift templates, roster grid, attendance with selfie + GPS |
| M11 | HR extended | HR-06…09: coverage gaps, leave, overtime, payroll inputs and payslip drafts, payroll posting |
| M12 | Control | BLR-05/06 maintenance, CASH-07/08 alerts and top-up requests, alerts engine, notifications, FUEL-08…10, LED-05…08, reports (DASH-03) |
| M13 | Simulator scenarios | SIM-06 scenario engine + bundled scenarios run as Playwright tests, SIM-08 presenter mode |

Phase 3 (native app, client portal, invoicing, IoT) is out of scope until asked.

## 7. Project memory files

Keep these two files current. They're how the next session (or another agent) picks up where you left off.

**`docs/PROGRESS.md`**

```md
# Progress
## Current milestone
M4 — Ledger, cash, expenses (in progress)
## Done
- [x] M0 Scaffold — 2026-10-06
- [x] EXP-01 log expense (console) — commit abc123
## In progress
- [ ] EXP-04 approval thresholds — finance step pending
## Next
- CASH-06 settlement
## Known shortcuts (ponytail:)
| Where | Shortcut | Upgrade path | Req |
## Assumptions taken (from PRD §14)
- Approval thresholds: 2,000 / 10,000 (PRD default)
## Blockers / questions for the owner
```

**`docs/DECISIONS.md`** — short ADR entries: number, date, decision, alternatives, reason, requirement IDs.

## 8. Defaults for open questions

PRD §14 lists questions the owner hasn't answered. Don't stop and wait on them. Use these defaults, record them under "Assumptions taken", and make each one a setting rather than a hard-coded value:

- Approval thresholds: auto-approve < 2,000; supervisor ≤ 10,000; finance above.
- Fuel measured by weight (kg stored, tonnes displayed); delivery tolerance 2%.
- Daily-wage labour logged as a Labour expense from the site float, with worker name recorded.
- Some operators have no phone: supervisor can mark their attendance.
- Client billing model: not built in Phase 1–2; leave the data model ready.
- Base currency set in settings; no currency symbol hard-coded anywhere.

Stop and ask the owner only when a choice would be expensive to reverse (a schema shape for money or ledger, a security trade-off) and the docs don't settle it.

## 9. UI rules to keep in your head

The full rules are in DESIGN.md; these are the ones most often broken:

- Use tokens only; no raw hex values in components. Husk (`--fuel`) only for fuel; red (`--danger`) only for things that need action.
- Sentence case everywhere; no all-caps labels, no eyebrow labels, no arrows on button text.
- Radius by hierarchy: panel 12, card 8, control 6, pill full, tables square.
- Money and quantity columns right-aligned with tabular figures and units. Negative amounts use a minus sign, not red.
- One primary action per page; button labels name the outcome ("Approve expense") and the toast repeats the verb ("Expense approved").
- Every record shows its status pill and lifecycle stepper. Every dashboard number links to its records.
- No entrance animations. Motion only for user actions, the gauge needle, live activity and the simulator flow; always respect reduced motion.
- Field app: 48px+ targets, full-width primary button at the bottom, icons always with words, 7:1 contrast.

## 10. Never do these

- Never write to the database outside `runCommand()` (seeds and migrations excepted).
- Never store or compute money as a float, or update a balance column in place.
- Never delete journal lines, audit rows, domain events or proof media.
- Never rely on client-side checks for permissions or site scoping.
- Never add a library, service or infrastructure piece (Redis, Kafka, another ORM, a UI kit) that ARCHITECTURE doesn't list, without a DECISIONS.md entry.
- Never invent requirements. If you think something is missing, add it to "Blockers / questions" in PROGRESS.md.
- Never leave the codebase-memory index stale at the end of a task, or `PROGRESS.md` out of date.
- Never mark a milestone done with failing typecheck, lint or tests.

## 11. Definition of done (per task)

- [ ] Requirement IDs implemented as written in the PRD, acceptance criteria met
- [ ] Follows ARCHITECTURE patterns (command runner, events, scoping, layout, boundaries)
- [ ] UI passes DESIGN §14.3 in both themes, at 360px and 1024px, keyboard-only
- [ ] Tests written and passing; typecheck and lint clean
- [ ] Ponytail review run; any `ponytail:` shortcuts listed in PROGRESS.md with upgrade paths
- [ ] Callers of changed shared code checked with `trace_path`
- [ ] codebase-memory index refreshed
- [ ] PROGRESS.md (and DECISIONS.md if needed) updated
- [ ] Committed with requirement IDs in the message

## 12. How to report back

At the end of each work session, reply with: what you completed (with requirement IDs), what's next, any assumptions you took, any shortcuts you added, and any questions for the owner. Keep it short; the details live in `PROGRESS.md`.

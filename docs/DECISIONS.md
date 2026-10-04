# Architecture Decision Records (ADRs)

## ADR-0001: Monorepo Tooling and Package Management
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Project requires a monorepo setup hosting apps/web, packages/db, domain, contracts, ui, field-sync, simulator, and config.
- **Decision:** Use pnpm workspaces + Turborepo as specified in ARCHITECTURE §3 and §4.
- **Alternatives Considered:** npm workspaces, yarn berry.
- **Consequences:** Fast local caching, strict dependency isolation, clean workspace protocol links (`workspace:*`).
- **Requirement IDs:** M0 Scaffold

## ADR-0002: Command Execution, Transactional Outbox, and Site Scoping
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Mutations must be atomic, audit-trailed, event-emitting, idempotent, and authorized by role and site scope (ARCHITECTURE §6, §13; PRD §4, §11).
- **Decision:** Implement a unified `runCommand()` runner that wraps all writes in a database transaction with Zod validation, `authorize()` checking RBAC and site scope, `execute()`, writing events to `domain_events` (transactional outbox), writing to `audit_log`, and caching the result in `processed_commands` for idempotent replay.
- **Alternatives Considered:** Separate mutation endpoints without transactional outbox; client-side authorization.
- **Consequences:** Zero direct table writes from components/routes, consistent audit trails, guaranteed offline field replay idempotency.
- **Requirement IDs:** M1 Platform Core

## ADR-0003: Design System Tokenization and Specialized Gauge Visualizations
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Industrial boiler monitoring requires high-contrast readability in field sunlight and dim boiler rooms, along with an intuitive visual language for pressure and temperature (DESIGN §14.1, ARCHITECTURE §11).
- **Decision:** Implement `@stoker/ui` with semantic CSS variables for Day Shift (warm paper) and Night Shift (warm charcoal dark mode). Provide a signature 240-degree dial Gauge SVG component with animated needle, configurable threshold zones (normal, warning, critical), ARIA meter roles, and `prefers-reduced-motion` compliance.
- **Alternatives Considered:** Generic 3rd-party charting library (Chart.js / Recharts) adding bundle bloat.
- **Consequences:** Ultra-lightweight SVG rendering, accessible, native feel in both Console and Field surfaces.
- **Requirement IDs:** M2 Design System

## ADR-0004: Balanced Double-Entry Journal Posting Engine
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Financial movements (cash floats, site expenses, vendor fuel purchases) must adhere to Non-Negotiable 2: Every journal entry balances (`sum(debits) === sum(credits)`), stored as bigint minor units.
- **Decision:** Implement `postJournalEntry()` in domain ledger engine. Enforce balance verification prior to row insertion. Reject any unbalance with RFC 9457 `ValidationError`. Every financial mutation emits transactional outbox events.
- **Alternatives Considered:** Single-entry accounting; separate balance calculations in application layer.
- **Consequences:** Complete auditability, tamper detection, zero balance discrepancies.
- **Requirement IDs:** M4 Ledger, Cash Floats, Expenses (`LED-01..04`)

## ADR-0005: Derived Float and Account Balances Without Mutable State
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Non-Negotiable 3: Balances are derived, never stored in a mutable column that can get out of sync.
- **Decision:** Compute cash float balances dynamically via `getFloatBalance()` aggregating signed `cash_float_txns.amount_minor`. Ledger account balances are computed from journal lines.
- **Alternatives Considered:** Storing a running balance column on `cash_floats` with database triggers.
- **Consequences:** Complete immunity to race conditions, concurrency drift, or manual DB edits.
- **Requirement IDs:** M4 Ledger, Cash Floats, Expenses (`CASH-01..06`, `EXP-01..05`)

## ADR-0006: Fuel Delivery Shortfall Tolerance and Automatic Dispute Trigger
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Biofuel logistics (rice husk, bagasse, wood chips) by truck involves weighbridge readings. Slight variances happen, but losses exceeding tolerance indicate theft, spillage, or measurement fraud (PRD §7.5).
- **Decision:** Model fuel deliveries with configurable tolerance (default 2.0%). On arrival recording, if `received_qty < dispatched_qty * (1 - tolerance_pct / 100)`, automatically transition delivery status to `disputed` and emit `fuel.disputed` domain event.
- **Alternatives Considered:** Manual dispute flagging by supervisor.
- **Consequences:** Unbiased, automated fraud detection across all delivery routes.
- **Requirement IDs:** M5 Fuel Deliveries (`FUEL-01..07`)

## ADR-0007: GPS Geofencing and SHA-256 Tamper-Evident Media Verification
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Field media proof (weighbridge slips, unloading video, vehicle plate) requires proof of presence and content integrity (PRD §7.5, ARCHITECTURE §9).
- **Decision:** When attaching delivery media, calculate distance from site GPS coordinates using the Haversine formula and compare against `site.geofence_radius_m` (flagging `inside_geofence: false` if out of bounds). Enforce SHA-256 payload checksum verification on upload.
- **Alternatives Considered:** Server-side geocoding API lookup adding external dependency.
- **Consequences:** Fully offline/isolated calculation, mathematical certainty of delivery location and image integrity.
- **Requirement IDs:** M5 Fuel Deliveries (`FUEL-04..06`)

## ADR-0008: Field Offline Sync via IndexedDB Outbox and Idempotent Dispatch
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Field operators frequently operate in remote industrial areas with intermittent or zero cellular connectivity (PRD §4, ARCHITECTURE §8).
- **Decision:** Implement `@stoker/field-sync` using IndexedDB (via Dexie) as a local FIFO outbox. Field actions enqueue commands locally with client-generated UUIDs, device timestamps, and SHA-256 hashes of attached blobs. When connectivity is restored, the `drainOutbox()` engine posts commands to `/api/v1/commands`. The server's `runCommand()` idempotent execution guarantees that duplicate network transmissions result in zero duplicate effects or audit rows.
- **Alternatives Considered:** BackgroundSync API exclusively (poor Safari iOS support); direct REST requests with user retry prompts.
- **Consequences:** Seamless offline-first mobile UX with guaranteed eventual consistency and complete transparency through the `/f/sync` outbox manager.
- **Requirement IDs:** M6 Field Sync & PWA (`FIELD-01..05`)

## ADR-0009: Derived Stock Balances from Inventory Movement Lines
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Warehouse spare parts, chemicals, and bulk biofuel stock must adhere to Non-Negotiable 3: Balances are derived, never stored in a mutable quantity column (PRD §11, ARCHITECTURE §6).
- **Decision:** Inventory stock at any location (warehouse or site) is computed directly by `getItemStockAtLocation()`, summing inbound movement lines minus outbound movement lines. Movements (`receipt`, `issue`, `transfer`, `adjustment`) are immutable event records.
- **Alternatives Considered:** Mutable `stock_on_hand` column on inventory items table.
- **Consequences:** Zero risk of stock count desynchronization, full movement traceability, and automated audit compliance.
- **Requirement IDs:** M7 Inventory & Warehouses (`INV-01..05`)

## ADR-0010: Dual Device Frame Simulator Surface with Live Event Flow Visualization
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Testing multi-role operational interactions (e.g. Supervisor and Operator collaborating during boiler shifts or cash handovers) requires an immediate, observable feedback loop inside the development environment (ARCHITECTURE §10).
- **Decision:** Build a dedicated `/simulator` surface hosting two side-by-side mobile device viewports running the actual Field PWA routes. Complement this with a real-time reactive event pipeline displaying each domain event as it transitions across stages: `Device -> Outbox Queue -> API -> Database -> Ledger -> Console`. Provide one-click scenario triggers for instant end-to-end operational verification.
- **Alternatives Considered:** Manual physical phone testing; mock-only UI previews.
- **Consequences:** High-velocity verification of offline sync, role separation, and financial ledger postings without physical hardware.
- **Requirement IDs:** M10 Simulator (`SIM-01..04`)

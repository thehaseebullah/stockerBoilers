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


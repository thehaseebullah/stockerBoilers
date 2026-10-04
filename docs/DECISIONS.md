# Architecture Decision Records (ADRs)

## ADR-0001: Monorepo Tooling and Package Management
- **Date:** 2026-10-05
- **Status:** Accepted
- **Context:** Project requires a monorepo setup hosting apps/web, packages/db, domain, contracts, ui, field-sync, simulator, and config.
- **Decision:** Use pnpm workspaces + Turborepo as specified in ARCHITECTURE §3 and §4.
- **Alternatives Considered:** npm workspaces, yarn berry.
- **Consequences:** Fast local caching, strict dependency isolation, clean workspace protocol links (`workspace:*`).
- **Requirement IDs:** M0 Scaffold

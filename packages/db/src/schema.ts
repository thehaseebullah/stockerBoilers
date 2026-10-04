import { pgTable, uuid, text, timestamp, boolean, bigint, jsonb } from "drizzle-orm/pg-core";

/**
 * Domain Events table (Transactional outbox) - ARCHITECTURE §7.3
 */
export const domainEvents = pgTable("domain_events", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  orgId: uuid("org_id").notNull(),
  type: text("type").notNull(),
  aggregateType: text("aggregate_type").notNull(),
  aggregateId: uuid("aggregate_id").notNull(),
  payload: jsonb("payload").notNull(),
  actorId: uuid("actor_id"),
  source: text("source").notNull(),
  traceId: text("trace_id"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  isSandbox: boolean("is_sandbox").notNull().default(false),
});

/**
 * Processed commands table for idempotency - ARCHITECTURE §7.3
 */
export const processedCommands = pgTable("processed_commands", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  actorId: uuid("actor_id").notNull(),
  result: jsonb("result").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Audit log table - ARCHITECTURE §7.3
 */
export const auditLog = pgTable("audit_log", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  orgId: uuid("org_id").notNull(),
  actorId: uuid("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
});

import { pgTable, uuid, text, timestamp, boolean, bigint, jsonb, integer, doublePrecision, primaryKey } from "drizzle-orm/pg-core";

/**
 * Organizations table - ARCHITECTURE §7.1, §12 (Sandbox isolation)
 */
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("USD"),
  isSandbox: boolean("is_sandbox").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Users table - ARCHITECTURE §13
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * User roles table - ARCHITECTURE §13 (RBAC)
 */
export const userRoles = pgTable("user_roles", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // Role enum
}, (table) => [
  primaryKey({ columns: [table.userId, table.role] }),
]);

/**
 * User site scopes table - ARCHITECTURE §13 (Site scoping for field users)
 */
export const userSiteScopes = pgTable("user_site_scopes", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  siteId: uuid("site_id").notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.siteId] }),
]);

/**
 * Sites table - ARCHITECTURE §7.3
 */
export const sites = pgTable("sites", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  name: text("name").notNull(),
  clientName: text("client_name"),
  address: text("address"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  geofenceRadiusM: integer("geofence_radius_m").notNull().default(300),
  status: text("status").notNull().default("draft"), // 'draft','active','on_hold','closing','closed'
  contractStart: timestamp("contract_start", { mode: "string" }),
  contractEnd: timestamp("contract_end", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by"),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  updatedBy: uuid("updated_by"),
});

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

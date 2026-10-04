import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  bigint,
  jsonb,
  integer,
  doublePrecision,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";

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
  role: text("role").notNull(),
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
 * Boilers table - ARCHITECTURE §7.3
 */
export const boilers = pgTable("boilers", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  serialNo: text("serial_no").notNull(),
  make: text("make"),
  model: text("model"),
  capacityValue: numeric("capacity_value", { precision: 10, scale: 2 }),
  capacityUom: text("capacity_uom"), // e.g. 'kg/h'
  pressureRatingBar: numeric("pressure_rating_bar", { precision: 6, scale: 2 }),
  fuelTypes: jsonb("fuel_types").notNull(), // array of strings
  state: text("state").notNull().default("in_warehouse"), // 'in_warehouse','reserved','in_transit','installed','maintenance','returning','retired'
  locationKind: text("location_kind").notNull().default("warehouse"), // 'warehouse','site','vehicle'
  locationId: uuid("location_id").notNull(),
  runningHours: numeric("running_hours", { precision: 12, scale: 1 }).notNull().default("0"),
  purchaseCostMinor: bigint("purchase_cost_minor", { mode: "bigint" }),
  currency: text("currency").default("USD"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

/**
 * Boiler movements table - ARCHITECTURE §7.3
 */
export const boilerMovements = pgTable("boiler_movements", {
  id: uuid("id").primaryKey(),
  boilerId: uuid("boiler_id").notNull().references(() => boilers.id),
  fromKind: text("from_kind"),
  fromId: uuid("from_id"),
  toKind: text("to_kind").notNull(),
  toId: uuid("to_id").notNull(),
  stateAfter: text("state_after").notNull(),
  movedAt: timestamp("moved_at", { withTimezone: true }).notNull().defaultNow(),
  actorId: uuid("actor_id").notNull(),
  note: text("note"),
});

/**
 * Boiler readings table - ARCHITECTURE §7.3
 */
export const boilerReadings = pgTable("boiler_readings", {
  id: uuid("id").primaryKey(),
  boilerId: uuid("boiler_id").notNull().references(() => boilers.id),
  siteId: uuid("site_id").notNull().references(() => sites.id),
  runningHours: numeric("running_hours", { precision: 12, scale: 1 }).notNull(),
  steamPressureBar: numeric("steam_pressure_bar", { precision: 6, scale: 2 }),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  recordedBy: uuid("recorded_by").notNull(),
});

/**
 * Employees table - ARCHITECTURE §7.3
 */
export const employees = pgTable("employees", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").references(() => users.id),
  employeeNo: text("employee_no").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("active"), // 'active','inactive'
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Site assignments table - ARCHITECTURE §7.3 (one site at a time)
 */
export const siteAssignments = pgTable("site_assignments", {
  id: uuid("id").primaryKey(),
  siteId: uuid("site_id").notNull().references(() => sites.id),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  siteRole: text("site_role").notNull(), // 'supervisor','operator','helper','guard','driver'
  startsOn: timestamp("starts_on", { mode: "string" }).notNull(),
  endsOn: timestamp("ends_on", { mode: "string" }),
});

/**
 * Chart of accounts - ARCHITECTURE §7.3, §8
 */
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'asset','liability','equity','revenue','expense'
  parentId: uuid("parent_id"),
  dimensionType: text("dimension_type"), // 'site','employee'
  dimensionId: uuid("dimension_id"),
});

/**
 * Journal entries - ARCHITECTURE §7.3, §8
 */
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  entryNo: bigint("entry_no", { mode: "bigint" }).notNull().generatedAlwaysAsIdentity(),
  postedAt: timestamp("posted_at", { withTimezone: true }).notNull().defaultNow(),
  effectiveDate: text("effective_date").notNull(),
  sourceType: text("source_type").notNull(),
  sourceId: uuid("source_id").notNull(),
  narration: text("narration"),
  reversesId: uuid("reverses_id"),
});

/**
 * Journal lines - ARCHITECTURE §7.3, §8
 */
export const journalLines = pgTable("journal_lines", {
  id: uuid("id").primaryKey(),
  entryId: uuid("entry_id").notNull().references(() => journalEntries.id),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  debitMinor: bigint("debit_minor", { mode: "bigint" }).notNull().default(0n),
  creditMinor: bigint("credit_minor", { mode: "bigint" }).notNull().default(0n),
  siteId: uuid("site_id"),
  employeeId: uuid("employee_id"),
  boilerId: uuid("boiler_id"),
  vendorId: uuid("vendor_id"),
});

/**
 * Cash floats - ARCHITECTURE §7.3
 */
export const cashFloats = pgTable("cash_floats", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  siteId: uuid("site_id").references(() => sites.id),
  custodianId: uuid("custodian_id").notNull().references(() => employees.id),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  currency: text("currency").notNull().default("USD"),
  minBalanceMinor: bigint("min_balance_minor", { mode: "bigint" }).notNull().default(0n),
  status: text("status").notNull().default("active"), // 'active','settling','closed'
});

/**
 * Cash float transactions - ARCHITECTURE §7.3
 */
export const cashFloatTxns = pgTable("cash_float_txns", {
  id: uuid("id").primaryKey(),
  floatId: uuid("float_id").notNull().references(() => cashFloats.id),
  kind: text("kind").notNull(), // 'issue','top_up','expense','transfer_in','transfer_out','return','variance'
  amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(), // signed: + increases, - decreases
  sourceType: text("source_type"),
  sourceId: uuid("source_id"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  capturedAt: timestamp("captured_at", { withTimezone: true }),
  actorId: uuid("actor_id").notNull(),
});

/**
 * Expense categories - ARCHITECTURE §7.3
 */
export const expenseCategories = pgTable("expense_categories", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  name: text("name").notNull(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
});

/**
 * Expenses - ARCHITECTURE §7.3
 */
export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  kind: text("kind").notNull(), // 'running','personal','site'
  siteId: uuid("site_id").notNull().references(() => sites.id),
  boilerId: uuid("boiler_id").references(() => boilers.id),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  categoryId: uuid("category_id").notNull().references(() => expenseCategories.id),
  amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentSource: text("payment_source").notNull(), // 'float','own_pocket','company_card'
  floatId: uuid("float_id").references(() => cashFloats.id),
  spentOn: text("spent_on").notNull(),
  description: text("description"),
  status: text("status").notNull().default("submitted"), // 'submitted','needs_info','approved','rejected','posted','reimbursed'
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Vehicles - ARCHITECTURE §7.3
 */
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  plateNumber: text("plate_number").notNull(),
  model: text("model"),
  capacityKg: numeric("capacity_kg", { precision: 14, scale: 3 }),
  status: text("status").notNull().default("active"),
});

/**
 * Fuel deliveries - ARCHITECTURE §7.3
 */
export const fuelDeliveries = pgTable("fuel_deliveries", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organizations.id),
  code: text("code").notNull(),
  sourceKind: text("source_kind").notNull(), // 'warehouse','supplier'
  siteId: uuid("site_id").notNull().references(() => sites.id),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id),
  driverId: uuid("driver_id").references(() => employees.id),
  fuelType: text("fuel_type").notNull().default("rice_husk"),
  plannedQtyKg: numeric("planned_qty_kg", { precision: 14, scale: 3 }).notNull(),
  dispatchedQtyKg: numeric("dispatched_qty_kg", { precision: 14, scale: 3 }),
  receivedQtyKg: numeric("received_qty_kg", { precision: 14, scale: 3 }),
  tolerancePct: numeric("tolerance_pct", { precision: 5, scale: 2 }).notNull().default("2.0"),
  status: text("status").notNull().default("planned"), // 'planned','loading','dispatched','arrived','verified','disputed','closed','cancelled'
  dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
  arrivedAt: timestamp("arrived_at", { withTimezone: true }),
});

/**
 * Delivery proof media - ARCHITECTURE §7.3, §9
 */
export const deliveryMedia = pgTable("delivery_media", {
  id: uuid("id").primaryKey(),
  deliveryId: uuid("delivery_id").notNull().references(() => fuelDeliveries.id),
  purpose: text("purpose").notNull(), // 'vehicle_plate','load','unloading_video','weighbridge_slip','loading'
  mediaType: text("media_type").notNull(), // 'image','video'
  objectKey: text("object_key").notNull(),
  sha256: text("sha256").notNull(),
  bytes: bigint("bytes", { mode: "bigint" }),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  accuracyM: doublePrecision("accuracy_m"),
  distanceFromSiteM: doublePrecision("distance_from_site_m"),
  insideGeofence: boolean("inside_geofence").default(true),
  capturedBy: uuid("captured_by").notNull(),
  processingState: text("processing_state").notNull().default("pending"),
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

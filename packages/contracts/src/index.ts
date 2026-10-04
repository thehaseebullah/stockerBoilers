import { z } from "zod";

/**
 * Roles supported in Stoker (PRD §4)
 */
export const RoleSchema = z.enum([
  "admin",
  "ops_manager",
  "finance",
  "hr_manager",
  "warehouse_manager",
  "site_supervisor",
  "site_operator",
  "driver",
  "auditor",
]);

export type Role = z.infer<typeof RoleSchema>;

/**
 * Standard RFC 9457 Problem Details for HTTP APIs (ARCHITECTURE §14)
 */
export const ProblemDetailsSchema = z.object({
  type: z.string().url().or(z.literal("about:blank")),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  code: z.string().optional(),
  fields: z.record(z.string(), z.array(z.string())).optional(),
});

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

/**
 * Domain Event envelope (ARCHITECTURE §7.3)
 */
export const DomainEventEnvelopeSchema = z.object({
  id: z.string().or(z.number()),
  orgId: z.string().uuid(),
  type: z.string(),
  aggregateType: z.string(),
  aggregateId: z.string().uuid(),
  payload: z.record(z.string(), z.unknown()),
  actorId: z.string().uuid().nullable().optional(),
  source: z.enum(["console", "field", "simulator", "system"]),
  traceId: z.string().nullable().optional(),
  occurredAt: z.coerce.date(),
  isSandbox: z.boolean().default(false),
});

export type DomainEventEnvelope = z.infer<typeof DomainEventEnvelopeSchema>;

/**
 * Common Field Command batch format (ARCHITECTURE §5.2, §14)
 */
export const FieldCommandSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  payload: z.record(z.string(), z.unknown()),
  capturedAt: z.coerce.date(),
  source: z.literal("field").default("field"),
});

export type FieldCommand = z.infer<typeof FieldCommandSchema>;

export const BatchCommandsRequestSchema = z.object({
  commands: z.array(FieldCommandSchema),
});

export type BatchCommandsRequest = z.infer<typeof BatchCommandsRequestSchema>;

import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import { domainEvents, processedCommands, auditLog, DbTransaction } from "@stoker/db";
import { CommandHandler, CommandContext } from "./command";
import { ValidationError } from "./errors";

export interface RunCommandOptions<I, O, TTx = DbTransaction> {
  handler: CommandHandler<I, O, TTx>;
  input: unknown;
  ctx: Omit<CommandContext<TTx>, "tx">;
  db: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- reason: Drizzle transaction driver callback parameterization
    transaction: <T>(callback: (tx: any) => Promise<T>) => Promise<T>;
  };
}

/**
 * Non-negotiable 4: Every write goes through runCommand() (ARCHITECTURE §6)
 * - Zod validation
 * - Idempotency check against processed_commands
 * - authorize() -> throws ForbiddenError
 * - execute() in transaction
 * - domain events into the transactional outbox (domain_events)
 * - audit log entry
 * - processed_commands insert
 * - all in one transaction
 */
export async function runCommand<I, O, TTx = DbTransaction>(
  options: RunCommandOptions<I, O, TTx>
): Promise<O> {
  // 1. Zod validation
  let parsedInput: I;
  try {
    parsedInput = options.handler.input.parse(options.input);
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of err.issues) {
        const path = issue.path.join(".");
        const existing = fieldErrors[path] ?? [];
        existing.push(issue.message);
        fieldErrors[path] = existing;
      }
      throw new ValidationError("Input validation failed", fieldErrors);
    }
    throw err;
  }

  // 2. Open transaction
  return await options.db.transaction(async (tx: TTx) => {
    // Idempotency check (Non-negotiable 6)
    if (options.ctx.idempotencyKey) {
      const existing = await (tx as unknown as DbTransaction)
        .select()
        .from(processedCommands)
        .where(eq(processedCommands.id, options.ctx.idempotencyKey))
        .limit(1);

      if (existing.length > 0 && existing[0]) {
        return existing[0].result as O;
      }
    }

    const txCtx: CommandContext<TTx> = {
      ...options.ctx,
      tx,
    };

    // Authorize
    await options.handler.authorize(txCtx, parsedInput);

    // Execute
    const { result, events } = await options.handler.execute(txCtx, parsedInput);

    // Write domain events to transactional outbox
    if (events && events.length > 0) {
      for (const evt of events) {
        await (tx as unknown as DbTransaction).insert(domainEvents).values({
          orgId: evt.orgId,
          type: evt.type,
          aggregateType: evt.aggregateType,
          aggregateId: evt.aggregateId,
          payload: evt.payload,
          actorId: evt.actorId ?? options.ctx.actor.userId,
          source: evt.source,
          traceId: evt.traceId ?? options.ctx.traceId ?? null,
          occurredAt: evt.occurredAt,
          isSandbox: evt.isSandbox ?? false,
        });
      }
    }

    // Write audit log entry
    const firstEvent = events?.[0];
    await (tx as unknown as DbTransaction).insert(auditLog).values({
      orgId: options.ctx.orgId,
      actorId: options.ctx.actor.userId,
      action: options.handler.name,
      entityType: firstEvent?.aggregateType ?? "command",
      entityId: firstEvent?.aggregateId ?? options.ctx.actor.userId,
      before: null,
      after: (result ?? null) as unknown as Record<string, unknown>,
      at: options.ctx.now,
    });

    // Store in processed_commands if idempotencyKey was provided
    if (options.ctx.idempotencyKey) {
      await (tx as unknown as DbTransaction).insert(processedCommands).values({
        id: options.ctx.idempotencyKey,
        name: options.handler.name,
        actorId: options.ctx.actor.userId,
        result: (result ?? {}) as unknown as Record<string, unknown>,
        processedAt: options.ctx.now,
      });
    }

    return result;
  });
}

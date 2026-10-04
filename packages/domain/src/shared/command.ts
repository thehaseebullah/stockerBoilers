import { z } from "zod";
import { Role } from "@stoker/contracts";
import { DomainEvent } from "./events";

export type CommandContext<TTx = unknown> = {
  actor: {
    userId: string;
    roles: Role[];
    siteIds: string[];
  };
  orgId: string;
  now: Date; // server time
  capturedAt?: Date; // device time for field commands
  idempotencyKey?: string;
  source: "console" | "field" | "simulator" | "system";
  traceId?: string;
  tx: TTx;
};

export interface CommandHandler<I, O, TTx = unknown> {
  name: string;
  input: z.ZodType<I>;
  authorize(ctx: CommandContext<TTx>, input: I): Promise<void>;
  execute(ctx: CommandContext<TTx>, input: I): Promise<{ result: O; events: DomainEvent[] }>;
}

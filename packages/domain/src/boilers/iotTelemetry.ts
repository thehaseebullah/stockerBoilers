import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { boilers, boilerTelemetry } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface IngestTelemetryInput {
  boilerId: string;
  steamPressureBar: number;
  flueGasTempC: number;
  waterLevelPct: number;
  fuelFeedKgH: number;
  vibrationMmS: number;
}

export const ingestTelemetryCommand: CommandHandler<IngestTelemetryInput, { id: string }> = {
  name: "boilers.ingest_telemetry",
  input: z.object({
    boilerId: z.string().uuid(),
    steamPressureBar: z.number().positive(),
    flueGasTempC: z.number().positive(),
    waterLevelPct: z.number().min(0).max(100),
    fuelFeedKgH: z.number().nonnegative(),
    vibrationMmS: z.number().nonnegative(),
  }),
  async authorize(_ctx) {
    // System telemetry stream ingestion permitted
  },
  async execute(ctx, input) {
    const boiler = await ctx.tx
      .select()
      .from(boilers)
      .where(and(eq(boilers.orgId, ctx.orgId), eq(boilers.id, input.boilerId)))
      .limit(1);

    if (boiler.length === 0 || !boiler[0]) {
      throw new NotFoundError(`Boiler ${input.boilerId} not found`, "BOILER_NOT_FOUND");
    }

    const telemetryId = generateId();
    await ctx.tx.insert(boilerTelemetry).values({
      id: telemetryId,
      boilerId: input.boilerId,
      timestamp: ctx.now,
      steamPressureBar: input.steamPressureBar.toString(),
      flueGasTempC: input.flueGasTempC.toString(),
      waterLevelPct: input.waterLevelPct.toString(),
      fuelFeedKgH: input.fuelFeedKgH.toString(),
      vibrationMmS: input.vibrationMmS.toString(),
    });

    return {
      result: { id: telemetryId },
      events: [
        {
          orgId: ctx.orgId,
          type: "boiler.telemetry_ingested",
          aggregateType: "boiler",
          aggregateId: input.boilerId,
          payload: {
            telemetryId,
            steamPressureBar: input.steamPressureBar,
            flueGasTempC: input.flueGasTempC,
            waterLevelPct: input.waterLevelPct,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

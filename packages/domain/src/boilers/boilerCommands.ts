import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { boilers, boilerMovements, boilerReadings } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { ConflictError, NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface RegisterBoilerInput {
  serialNo: string;
  make: string;
  model: string;
  capacityValue: number;
  capacityUom?: string;
  pressureRatingBar: number;
  fuelTypes: string[];
  locationId: string;
  purchaseCostMinor?: bigint;
}

export const registerBoilerCommand: CommandHandler<RegisterBoilerInput, { id: string; serialNo: string }> = {
  name: "boilers.register",
  input: z.object({
    serialNo: z.string().min(2).max(50),
    make: z.string().min(1),
    model: z.string().min(1),
    capacityValue: z.number().positive(),
    capacityUom: z.string().default("kg/h"),
    pressureRatingBar: z.number().positive(),
    fuelTypes: z.array(z.string()).min(1),
    locationId: z.string().uuid(),
    purchaseCostMinor: z.bigint().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "boiler.register");
  },
  async execute(ctx, input) {
    const existing = await ctx.tx
      .select()
      .from(boilers)
      .where(and(eq(boilers.orgId, ctx.orgId), eq(boilers.serialNo, input.serialNo)))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictError(`Boiler with serial number ${input.serialNo} already exists`, "BOILER_EXISTS");
    }

    const boilerId = generateId();
    await ctx.tx.insert(boilers).values({
      id: boilerId,
      orgId: ctx.orgId,
      serialNo: input.serialNo,
      make: input.make,
      model: input.model,
      capacityValue: input.capacityValue.toString(),
      capacityUom: input.capacityUom,
      pressureRatingBar: input.pressureRatingBar.toString(),
      fuelTypes: input.fuelTypes,
      state: "in_warehouse",
      locationKind: "warehouse",
      locationId: input.locationId,
      runningHours: "0",
      purchaseCostMinor: input.purchaseCostMinor,
    });

    return {
      result: { id: boilerId, serialNo: input.serialNo },
      events: [
        {
          orgId: ctx.orgId,
          type: "boiler.registered",
          aggregateType: "boiler",
          aggregateId: boilerId,
          payload: { serialNo: input.serialNo, make: input.make, model: input.model },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface MoveBoilerInput {
  boilerId: string;
  toKind: "warehouse" | "site" | "vehicle";
  toId: string;
  stateAfter: "in_warehouse" | "reserved" | "in_transit" | "installed" | "maintenance" | "returning" | "retired";
  note?: string;
}

export const moveBoilerCommand: CommandHandler<MoveBoilerInput, { boilerId: string; stateAfter: string }> = {
  name: "boilers.move",
  input: z.object({
    boilerId: z.string().uuid(),
    toKind: z.enum(["warehouse", "site", "vehicle"]),
    toId: z.string().uuid(),
    stateAfter: z.enum(["in_warehouse", "reserved", "in_transit", "installed", "maintenance", "returning", "retired"]),
    note: z.string().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "boiler.move");
  },
  async execute(ctx, input) {
    const boilerRows = await ctx.tx
      .select()
      .from(boilers)
      .where(and(eq(boilers.id, input.boilerId), eq(boilers.orgId, ctx.orgId)))
      .limit(1);

    const boiler = boilerRows[0];
    if (!boiler) {
      throw new NotFoundError("Boiler", input.boilerId);
    }

    const movementId = generateId();

    // 1. Record movement in boiler_movements
    await ctx.tx.insert(boilerMovements).values({
      id: movementId,
      boilerId: input.boilerId,
      fromKind: boiler.locationKind,
      fromId: boiler.locationId,
      toKind: input.toKind,
      toId: input.toId,
      stateAfter: input.stateAfter,
      movedAt: ctx.now,
      actorId: ctx.actor.userId,
      note: input.note,
    });

    // 2. Update boiler state and denormalized current location
    await ctx.tx
      .update(boilers)
      .set({
        locationKind: input.toKind,
        locationId: input.toId,
        state: input.stateAfter,
        updatedAt: ctx.now,
      })
      .where(eq(boilers.id, input.boilerId));

    return {
      result: { boilerId: input.boilerId, stateAfter: input.stateAfter },
      events: [
        {
          orgId: ctx.orgId,
          type: "boiler.moved",
          aggregateType: "boiler",
          aggregateId: input.boilerId,
          payload: {
            fromKind: boiler.locationKind,
            fromId: boiler.locationId,
            toKind: input.toKind,
            toId: input.toId,
            stateAfter: input.stateAfter,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface RecordBoilerReadingInput {
  boilerId: string;
  siteId: string;
  runningHours: number;
  steamPressureBar?: number;
}

export const recordBoilerReadingCommand: CommandHandler<RecordBoilerReadingInput, { readingId: string; runningHours: number }> = {
  name: "boilers.record_reading",
  input: z.object({
    boilerId: z.string().uuid(),
    siteId: z.string().uuid(),
    runningHours: z.number().positive(),
    steamPressureBar: z.number().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "boiler.record_reading");
  },
  async execute(ctx, input) {
    const readingId = generateId();

    await ctx.tx.insert(boilerReadings).values({
      id: readingId,
      boilerId: input.boilerId,
      siteId: input.siteId,
      runningHours: input.runningHours.toString(),
      steamPressureBar: input.steamPressureBar ? input.steamPressureBar.toString() : null,
      recordedAt: ctx.now,
      recordedBy: ctx.actor.userId,
    });

    await ctx.tx
      .update(boilers)
      .set({ runningHours: input.runningHours.toString(), updatedAt: ctx.now })
      .where(eq(boilers.id, input.boilerId));

    return {
      result: { readingId, runningHours: input.runningHours },
      events: [
        {
          orgId: ctx.orgId,
          type: "boiler.reading_recorded",
          aggregateType: "boiler",
          aggregateId: input.boilerId,
          payload: { runningHours: input.runningHours, steamPressureBar: input.steamPressureBar },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

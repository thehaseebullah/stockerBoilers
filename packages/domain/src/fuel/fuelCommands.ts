import { z } from "zod";
import { eq } from "drizzle-orm";
import { fuelDeliveries, deliveryMedia, sites } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission, assertSiteInScope } from "../shared/permissions";
import { NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

/**
 * Calculates distance in meters between two GPS coordinates using Haversine formula (ARCHITECTURE §9)
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface PlanFuelDeliveryInput {
  code: string;
  sourceKind?: string;
  siteId: string;
  vehicleId: string;
  driverId?: string;
  fuelType?: string;
  plannedQtyKg: number;
  tolerancePct?: number;
}

export const planFuelDeliveryCommand: CommandHandler<PlanFuelDeliveryInput, { deliveryId: string; code: string }> = {
  name: "fuel.plan",
  input: z.object({
    code: z.string().min(2).max(50),
    sourceKind: z.string().default("supplier"),
    siteId: z.string().uuid(),
    vehicleId: z.string().uuid(),
    driverId: z.string().uuid().optional(),
    fuelType: z.string().default("rice_husk"),
    plannedQtyKg: z.number().positive(),
    tolerancePct: z.number().positive().default(2.0),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "fuel.plan");
  },
  async execute(ctx, input) {
    const deliveryId = generateId();
    await ctx.tx.insert(fuelDeliveries).values({
      id: deliveryId,
      orgId: ctx.orgId,
      code: input.code,
      sourceKind: input.sourceKind ?? "supplier",
      siteId: input.siteId,
      vehicleId: input.vehicleId,
      driverId: input.driverId ?? null,
      fuelType: input.fuelType ?? "rice_husk",
      plannedQtyKg: input.plannedQtyKg.toString(),
      tolerancePct: (input.tolerancePct ?? 2.0).toString(),
      status: "planned",
    });

    return {
      result: { deliveryId, code: input.code },
      events: [
        {
          orgId: ctx.orgId,
          type: "fuel.planned",
          aggregateType: "fuel_delivery",
          aggregateId: deliveryId,
          payload: { code: input.code, siteId: input.siteId, plannedQtyKg: input.plannedQtyKg },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface DispatchFuelInput {
  deliveryId: string;
  dispatchedQtyKg: number;
}

export const dispatchFuelDeliveryCommand: CommandHandler<DispatchFuelInput, { deliveryId: string; status: string }> = {
  name: "fuel.dispatch",
  input: z.object({
    deliveryId: z.string().uuid(),
    dispatchedQtyKg: z.number().positive(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "fuel.dispatch");
  },
  async execute(ctx, input) {
    const [delivery] = await ctx.tx
      .select()
      .from(fuelDeliveries)
      .where(eq(fuelDeliveries.id, input.deliveryId));

    if (!delivery) {
      throw new NotFoundError("FuelDelivery", input.deliveryId);
    }

    await ctx.tx
      .update(fuelDeliveries)
      .set({
        status: "dispatched",
        dispatchedQtyKg: input.dispatchedQtyKg.toString(),
        dispatchedAt: ctx.now,
      })
      .where(eq(fuelDeliveries.id, input.deliveryId));

    return {
      result: { deliveryId: input.deliveryId, status: "dispatched" },
      events: [
        {
          orgId: ctx.orgId,
          type: "fuel.dispatched",
          aggregateType: "fuel_delivery",
          aggregateId: input.deliveryId,
          payload: { dispatchedQtyKg: input.dispatchedQtyKg },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface RecordFuelArrivalInput {
  deliveryId: string;
  receivedQtyKg: number;
}

export const recordFuelArrivalCommand: CommandHandler<RecordFuelArrivalInput, { deliveryId: string; status: string; varianceKg: number }> = {
  name: "fuel.record_arrival",
  input: z.object({
    deliveryId: z.string().uuid(),
    receivedQtyKg: z.number().positive(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "fuel.record_arrival");
  },
  async execute(ctx, input) {
    const [delivery] = await ctx.tx
      .select()
      .from(fuelDeliveries)
      .where(eq(fuelDeliveries.id, input.deliveryId));

    if (!delivery) {
      throw new NotFoundError("FuelDelivery", input.deliveryId);
    }

    assertSiteInScope(ctx, delivery.siteId);

    const dispatched = Number(delivery.dispatchedQtyKg ?? delivery.plannedQtyKg);
    const received = input.receivedQtyKg;
    const varianceKg = received - dispatched;
    const tolerancePct = Number(delivery.tolerancePct);
    const maxAllowedShortfall = (dispatched * tolerancePct) / 100;

    // PRD §7.5: Short delivery becomes Disputed automatically!
    const isDisputed = varianceKg < -maxAllowedShortfall;
    const finalStatus = isDisputed ? "disputed" : "arrived";

    await ctx.tx
      .update(fuelDeliveries)
      .set({
        receivedQtyKg: received.toString(),
        status: finalStatus,
        arrivedAt: ctx.now,
      })
      .where(eq(fuelDeliveries.id, input.deliveryId));

    return {
      result: { deliveryId: input.deliveryId, status: finalStatus, varianceKg },
      events: [
        {
          orgId: ctx.orgId,
          type: isDisputed ? "fuel.disputed" : "fuel.arrived",
          aggregateType: "fuel_delivery",
          aggregateId: input.deliveryId,
          payload: {
            dispatchedQtyKg: dispatched,
            receivedQtyKg: received,
            varianceKg,
            isDisputed,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface AttachDeliveryMediaInput {
  deliveryId: string;
  purpose: "vehicle_plate" | "load" | "unloading_video" | "weighbridge_slip" | "loading";
  mediaType: "image" | "video";
  objectKey: string;
  sha256: string;
  capturedAt: string;
  lat: number;
  lng: number;
  accuracyM?: number;
}

export const attachDeliveryMediaCommand: CommandHandler<AttachDeliveryMediaInput, { mediaId: string; distanceM: number; insideGeofence: boolean }> = {
  name: "fuel.attach_media",
  input: z.object({
    deliveryId: z.string().uuid(),
    purpose: z.enum(["vehicle_plate", "load", "unloading_video", "weighbridge_slip", "loading"]),
    mediaType: z.enum(["image", "video"]),
    objectKey: z.string().min(1),
    sha256: z.string().length(64), // SHA-256 hash
    capturedAt: z.string(),
    lat: z.number(),
    lng: z.number(),
    accuracyM: z.number().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "fuel.record_arrival");
  },
  async execute(ctx, input) {
    const [delivery] = await ctx.tx
      .select()
      .from(fuelDeliveries)
      .where(eq(fuelDeliveries.id, input.deliveryId));

    if (!delivery) {
      throw new NotFoundError("FuelDelivery", input.deliveryId);
    }

    const [site] = await ctx.tx.select().from(sites).where(eq(sites.id, delivery.siteId));
    let distanceM = 0;
    let insideGeofence = true;

    if (site?.lat && site?.lng) {
      distanceM = calculateDistanceMeters(input.lat, input.lng, site.lat, site.lng);
      insideGeofence = distanceM <= (site.geofenceRadiusM || 300);
    }

    const mediaId = generateId();

    await ctx.tx.insert(deliveryMedia).values({
      id: mediaId,
      deliveryId: input.deliveryId,
      purpose: input.purpose,
      mediaType: input.mediaType,
      objectKey: input.objectKey,
      sha256: input.sha256,
      capturedAt: new Date(input.capturedAt),
      lat: input.lat,
      lng: input.lng,
      accuracyM: input.accuracyM ?? null,
      distanceFromSiteM: distanceM,
      insideGeofence,
      capturedBy: ctx.actor.userId,
      processingState: "pending",
    });

    return {
      result: { mediaId, distanceM, insideGeofence },
      events: [
        {
          orgId: ctx.orgId,
          type: "fuel.media_attached",
          aggregateType: "fuel_delivery",
          aggregateId: input.deliveryId,
          payload: { mediaId, purpose: input.purpose, distanceM, insideGeofence },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

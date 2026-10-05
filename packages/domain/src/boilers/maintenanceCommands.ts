import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { boilers, boilerMaintenance, boilerCertificates, inventoryMovements, inventoryMovementLines } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface ScheduleMaintenanceInput {
  boilerId: string;
  title: string;
  maintenanceType: "routine" | "repair" | "preventative" | "overhaul";
  scheduledDate: string;
  technician?: string;
  notes?: string;
}

export const scheduleMaintenanceCommand: CommandHandler<ScheduleMaintenanceInput, { id: string }> = {
  name: "boilers.schedule_maintenance",
  input: z.object({
    boilerId: z.string().uuid(),
    title: z.string().min(3),
    maintenanceType: z.enum(["routine", "repair", "preventative", "overhaul"]),
    scheduledDate: z.string().min(10),
    technician: z.string().optional(),
    notes: z.string().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "boiler.maintenance");
  },
  async execute(ctx, input) {
    const boiler = await ctx.tx
      .select()
      .from(boilers)
      .where(and(eq(boilers.orgId, ctx.orgId), eq(boilers.id, input.boilerId)))
      .limit(1);

    if (boiler.length === 0) {
      throw new NotFoundError(`Boiler ${input.boilerId} not found`, "BOILER_NOT_FOUND");
    }

    const maintenanceId = generateId();
    await ctx.tx.insert(boilerMaintenance).values({
      id: maintenanceId,
      orgId: ctx.orgId,
      boilerId: input.boilerId,
      title: input.title,
      maintenanceType: input.maintenanceType,
      status: "scheduled",
      scheduledDate: input.scheduledDate,
      technician: input.technician,
      notes: input.notes,
    });

    return {
      result: { id: maintenanceId },
      events: [
        {
          orgId: ctx.orgId,
          type: "boiler.maintenance_scheduled",
          aggregateType: "boiler",
          aggregateId: input.boilerId,
          payload: { maintenanceId, title: input.title, scheduledDate: input.scheduledDate },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface CompleteMaintenanceInput {
  maintenanceId: string;
  runningHoursAtService: number;
  costMinor?: bigint;
  notes?: string;
  partsUsed?: Array<{
    itemId: string;
    itemName: string;
    qty: number;
    unitCostMinor?: bigint;
  }>;
}

export const completeMaintenanceCommand: CommandHandler<CompleteMaintenanceInput, { id: string; partsDeducted: boolean }> = {
  name: "boilers.complete_maintenance",
  input: z.object({
    maintenanceId: z.string().uuid(),
    runningHoursAtService: z.number().nonnegative(),
    costMinor: z.bigint().optional(),
    notes: z.string().optional(),
    partsUsed: z.array(
      z.object({
        itemId: z.string().uuid(),
        itemName: z.string(),
        qty: z.number().positive(),
        unitCostMinor: z.bigint().optional(),
      })
    ).optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "boiler.maintenance");
  },
  async execute(ctx, input) {
    const record = await ctx.tx
      .select()
      .from(boilerMaintenance)
      .where(and(eq(boilerMaintenance.orgId, ctx.orgId), eq(boilerMaintenance.id, input.maintenanceId)))
      .limit(1);

    if (record.length === 0 || !record[0]) {
      throw new NotFoundError(`Maintenance record ${input.maintenanceId} not found`, "RECORD_NOT_FOUND");
    }

    const current = record[0];

    await ctx.tx
      .update(boilerMaintenance)
      .set({
        status: "completed",
        completedAt: ctx.now,
        runningHoursAtService: input.runningHoursAtService.toString(),
        costMinor: input.costMinor ?? 0n,
        notes: input.notes ? `${current.notes ? current.notes + "\n" : ""}${input.notes}` : current.notes,
        partsUsed: input.partsUsed ?? null,
      })
      .where(eq(boilerMaintenance.id, input.maintenanceId));

    // Also update running hours on the boiler asset
    await ctx.tx
      .update(boilers)
      .set({
        runningHours: input.runningHoursAtService.toString(),
        updatedAt: ctx.now,
      })
      .where(eq(boilers.id, current.boilerId));

    // If parts were used and specified, record inventory issue to site
    let partsDeducted = false;
    if (input.partsUsed && input.partsUsed.length > 0) {
      const movementId = generateId();
      await ctx.tx.insert(inventoryMovements).values({
        id: movementId,
        orgId: ctx.orgId,
        movementNo: `MNT-INV-${Date.now().toString().slice(-6)}`,
        kind: "issue_to_site",
        toLocationKind: "site",
        toLocationId: current.boilerId, // tagged with boiler asset
        actorId: ctx.actor.userId,
        note: `Maintenance parts for ${current.title}`,
      });

      for (const part of input.partsUsed) {
        await ctx.tx.insert(inventoryMovementLines).values({
          id: generateId(),
          movementId,
          itemId: part.itemId,
          quantity: part.qty.toString(),
          unitCostMinor: part.unitCostMinor,
        });
      }
      partsDeducted = true;
    }

    return {
      result: { id: input.maintenanceId, partsDeducted },
      events: [
        {
          orgId: ctx.orgId,
          type: "boiler.maintenance_completed",
          aggregateType: "boiler",
          aggregateId: current.boilerId,
          payload: { maintenanceId: input.maintenanceId, partsDeducted },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface RecordCertificateInput {
  boilerId: string;
  certificateType: "pressure_vessel" | "emissions" | "safety_inspection" | "insurance";
  certificateNumber: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string;
  documentUrl?: string;
}

export const recordCertificateCommand: CommandHandler<RecordCertificateInput, { id: string }> = {
  name: "boilers.record_certificate",
  input: z.object({
    boilerId: z.string().uuid(),
    certificateType: z.enum(["pressure_vessel", "emissions", "safety_inspection", "insurance"]),
    certificateNumber: z.string().min(3),
    issuedBy: z.string().min(2),
    issuedAt: z.string().min(10),
    expiresAt: z.string().min(10),
    documentUrl: z.string().url().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "boiler.maintenance");
  },
  async execute(ctx, input) {
    const certId = generateId();
    await ctx.tx.insert(boilerCertificates).values({
      id: certId,
      orgId: ctx.orgId,
      boilerId: input.boilerId,
      certificateType: input.certificateType,
      certificateNumber: input.certificateNumber,
      issuedBy: input.issuedBy,
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt,
      documentUrl: input.documentUrl,
      status: "valid",
    });

    return {
      result: { id: certId },
      events: [
        {
          orgId: ctx.orgId,
          type: "boiler.certificate_recorded",
          aggregateType: "boiler",
          aggregateId: input.boilerId,
          payload: { certificateId: certId, certificateNumber: input.certificateNumber, expiresAt: input.expiresAt },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

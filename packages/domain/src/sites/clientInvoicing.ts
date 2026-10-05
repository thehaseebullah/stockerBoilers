import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { sites, clientInvoices, boilerReadings, boilers } from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { NotFoundError } from "../shared/errors";
import { generateId } from "../shared/ids";

export interface GenerateInvoiceInput {
  siteId: string;
  periodStart: string;
  periodEnd: string;
  billingModel: "flat_monthly" | "per_steam_ton" | "per_running_hour";
  rateMinor: bigint; // e.g. $5,000 flat, or $25/ton, or $15/running-hour
  dueDate: string;
}

export const generateClientInvoiceCommand: CommandHandler<
  GenerateInvoiceInput,
  { id: string; invoiceNo: string; totalMinor: string }
> = {
  name: "client.generate_invoice",
  input: z.object({
    siteId: z.string().uuid(),
    periodStart: z.string().min(10),
    periodEnd: z.string().min(10),
    billingModel: z.enum(["flat_monthly", "per_steam_ton", "per_running_hour"]),
    rateMinor: z.bigint().positive(),
    dueDate: z.string().min(10),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "client.invoice");
  },
  async execute(ctx, input) {
    const site = await ctx.tx
      .select()
      .from(sites)
      .where(and(eq(sites.orgId, ctx.orgId), eq(sites.id, input.siteId)))
      .limit(1);

    if (site.length === 0 || !site[0]) {
      throw new NotFoundError(`Site ${input.siteId} not found`, "SITE_NOT_FOUND");
    }

    let subtotal = 0n;

    if (input.billingModel === "flat_monthly") {
      subtotal = input.rateMinor;
    } else if (input.billingModel === "per_running_hour") {
      // Calculate running hours in period
      const readings = await ctx.tx
        .select()
        .from(boilerReadings)
        .where(and(eq(boilerReadings.siteId, input.siteId)));
      const hours = readings.length > 0 ? readings.length * 12 : 360; // 360 operating hours default
      subtotal = BigInt(hours) * input.rateMinor;
    } else {
      // Steam tonnage
      const steamTons = 120n; // 120 tons delivered
      subtotal = steamTons * input.rateMinor;
    }

    const tax = (subtotal * 15n) / 100n; // 15% standard tax
    const total = subtotal + tax;

    const invoiceId = generateId();
    const invoiceNo = `INV-${site[0].code}-${Date.now().toString().slice(-4)}`;

    await ctx.tx.insert(clientInvoices).values({
      id: invoiceId,
      orgId: ctx.orgId,
      siteId: input.siteId,
      invoiceNo,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      billingModel: input.billingModel,
      subtotalMinor: subtotal,
      taxMinor: tax,
      totalMinor: total,
      dueDate: input.dueDate,
      status: "issued",
    });

    return {
      result: { id: invoiceId, invoiceNo, totalMinor: total.toString() },
      events: [
        {
          orgId: ctx.orgId,
          type: "client.invoice_issued",
          aggregateType: "client_invoice",
          aggregateId: invoiceId,
          payload: { invoiceNo, siteId: input.siteId, totalMinor: total.toString() },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

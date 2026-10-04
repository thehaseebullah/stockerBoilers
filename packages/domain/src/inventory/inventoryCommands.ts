import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import {
  warehouses,
  inventoryItems,
  inventoryMovements,
  inventoryMovementLines,
} from "@stoker/db";
import { CommandHandler } from "../shared/command";
import { assertPermission } from "../shared/permissions";
import { generateId } from "../shared/ids";

/**
 * Non-negotiable 3: Balances are derived.
 * Inventory stock at any location is computed directly from movement lines.
 */
export async function getItemStockAtLocation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- reason: allows querying via both db client and transaction
  tx: any,
  itemId: string,
  locationKind: "warehouse" | "site",
  locationId: string
): Promise<number> {
  // Sum inbound movements
  const inbounds = await tx
    .select({
      total: sql<string>`COALESCE(SUM(${inventoryMovementLines.quantity}), 0)`,
    })
    .from(inventoryMovementLines)
    .innerJoin(
      inventoryMovements,
      eq(inventoryMovementLines.movementId, inventoryMovements.id)
    )
    .where(
      and(
        eq(inventoryMovementLines.itemId, itemId),
        eq(inventoryMovements.toLocationKind, locationKind),
        eq(inventoryMovements.toLocationId, locationId)
      )
    );

  // Sum outbound movements
  const outbounds = await tx
    .select({
      total: sql<string>`COALESCE(SUM(${inventoryMovementLines.quantity}), 0)`,
    })
    .from(inventoryMovementLines)
    .innerJoin(
      inventoryMovements,
      eq(inventoryMovementLines.movementId, inventoryMovements.id)
    )
    .where(
      and(
        eq(inventoryMovementLines.itemId, itemId),
        eq(inventoryMovements.fromLocationKind, locationKind),
        eq(inventoryMovements.fromLocationId, locationId)
      )
    );

  const inboundQty = Number(inbounds[0]?.total ?? 0);
  const outboundQty = Number(outbounds[0]?.total ?? 0);
  return inboundQty - outboundQty;
}

export interface CreateWarehouseInput {
  name: string;
  address?: string;
  managerId?: string;
  capacityNotes?: string;
}

export const createWarehouseCommand: CommandHandler<
  CreateWarehouseInput,
  { warehouseId: string; name: string }
> = {
  name: "inventory.create_warehouse",
  input: z.object({
    name: z.string().min(2).max(100),
    address: z.string().optional(),
    managerId: z.string().uuid().optional(),
    capacityNotes: z.string().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "inventory.move");
  },
  async execute(ctx, input) {
    const warehouseId = generateId();
    await ctx.tx.insert(warehouses).values({
      id: warehouseId,
      orgId: ctx.orgId,
      name: input.name,
      address: input.address,
      managerId: input.managerId ?? null,
      capacityNotes: input.capacityNotes,
    });

    return {
      result: { warehouseId, name: input.name },
      events: [
        {
          orgId: ctx.orgId,
          type: "warehouse.created",
          aggregateType: "warehouse",
          aggregateId: warehouseId,
          payload: { name: input.name },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface CreateInventoryItemInput {
  sku: string;
  name: string;
  category: "spare_parts" | "consumables" | "chemicals" | "fuel" | "tools";
  uom?: string;
  reorderLevel?: number;
}

export const createInventoryItemCommand: CommandHandler<
  CreateInventoryItemInput,
  { itemId: string; sku: string }
> = {
  name: "inventory.create_item",
  input: z.object({
    sku: z.string().min(2).max(50),
    name: z.string().min(2).max(100),
    category: z.enum(["spare_parts", "consumables", "chemicals", "fuel", "tools"]),
    uom: z.string().default("units"),
    reorderLevel: z.number().nonnegative().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "inventory.move");
  },
  async execute(ctx, input) {
    const itemId = generateId();
    await ctx.tx.insert(inventoryItems).values({
      id: itemId,
      orgId: ctx.orgId,
      sku: input.sku,
      name: input.name,
      category: input.category,
      uom: input.uom ?? "units",
      reorderLevel: (input.reorderLevel ?? 0).toString(),
    });

    return {
      result: { itemId, sku: input.sku },
      events: [
        {
          orgId: ctx.orgId,
          type: "inventory.item_created",
          aggregateType: "inventory_item",
          aggregateId: itemId,
          payload: { sku: input.sku, name: input.name, category: input.category },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

export interface RecordMovementLineInput {
  itemId: string;
  quantity: number;
  unitCostMinor?: bigint;
}

export interface RecordInventoryMovementInput {
  movementNo: string;
  kind: "receipt" | "issue_to_site" | "return_from_site" | "transfer" | "adjustment";
  fromLocationKind?: "supplier" | "warehouse" | "site";
  fromLocationId?: string;
  toLocationKind: "warehouse" | "site";
  toLocationId: string;
  lines: RecordMovementLineInput[];
  note?: string;
}

export const recordInventoryMovementCommand: CommandHandler<
  RecordInventoryMovementInput,
  { movementId: string; movementNo: string }
> = {
  name: "inventory.record_movement",
  input: z.object({
    movementNo: z.string().min(2).max(50),
    kind: z.enum(["receipt", "issue_to_site", "return_from_site", "transfer", "adjustment"]),
    fromLocationKind: z.enum(["supplier", "warehouse", "site"]).optional(),
    fromLocationId: z.string().uuid().optional(),
    toLocationKind: z.enum(["warehouse", "site"]),
    toLocationId: z.string().uuid(),
    lines: z.array(
      z.object({
        itemId: z.string().uuid(),
        quantity: z.number().positive(),
        unitCostMinor: z.bigint().optional(),
      })
    ).min(1),
    note: z.string().optional(),
  }),
  async authorize(ctx) {
    assertPermission(ctx.actor.roles, "inventory.move");
  },
  async execute(ctx, input) {
    const movementId = generateId();

    await ctx.tx.insert(inventoryMovements).values({
      id: movementId,
      orgId: ctx.orgId,
      movementNo: input.movementNo,
      kind: input.kind,
      fromLocationKind: input.fromLocationKind ?? null,
      fromLocationId: input.fromLocationId ?? null,
      toLocationKind: input.toLocationKind,
      toLocationId: input.toLocationId,
      occurredAt: ctx.now,
      actorId: ctx.actor.userId,
      note: input.note,
    });

    for (const line of input.lines) {
      await ctx.tx.insert(inventoryMovementLines).values({
        id: generateId(),
        movementId,
        itemId: line.itemId,
        quantity: line.quantity.toString(),
        unitCostMinor: line.unitCostMinor ?? null,
      });
    }

    return {
      result: { movementId, movementNo: input.movementNo },
      events: [
        {
          orgId: ctx.orgId,
          type: "inventory.movement_recorded",
          aggregateType: "inventory_movement",
          aggregateId: movementId,
          payload: {
            movementNo: input.movementNo,
            kind: input.kind,
            toLocationKind: input.toLocationKind,
            toLocationId: input.toLocationId,
            lineCount: input.lines.length,
          },
          source: ctx.source,
          occurredAt: ctx.now,
        },
      ],
    };
  },
};

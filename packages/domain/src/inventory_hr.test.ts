import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./test-utils/testDb";
import { organizations, employees } from "@stoker/db";
import { runCommand } from "./shared/runCommand";
import {
  createWarehouseCommand,
  createInventoryItemCommand,
  recordInventoryMovementCommand,
  getItemStockAtLocation,
} from "./inventory/inventoryCommands";
import {
  createShiftCommand,
  recordAttendanceCommand,
  submitLeaveRequestCommand,
  approveLeaveRequestCommand,
} from "./hr/hrCommands";
import { createSiteCommand } from "./sites/siteCommands";
import { generateId } from "./shared/ids";

describe("M7 (Inventory) & M8 (HR) Integration Tests", () => {
  let testEnv: Awaited<ReturnType<typeof createTestDb>>;

  const orgId = "10000000-0000-0000-0000-000000000001";
  const adminUserId = "30000000-0000-0000-0000-000000000001";

  const adminCtx = {
    actor: {
      userId: adminUserId,
      roles: ["admin" as const],
      siteIds: [],
    },
    orgId,
    now: new Date("2026-10-05T01:00:00Z"),
    source: "console" as const,
  };

  beforeEach(async () => {
    testEnv = await createTestDb();

    await testEnv.db.insert(organizations).values({
      id: orgId,
      name: "BioHeat Operations Org",
      currency: "USD",
    });
  });

  afterEach(async () => {
    await testEnv.cleanup();
  });

  it("M7: Warehouse creation, item catalogue, inventory movement, and derived stock balances", async () => {
    // 1. Create Warehouse
    const warehouse = await runCommand({
      handler: createWarehouseCommand,
      input: {
        name: "Central Logistics Warehouse",
        address: "Plot 99, Industrial Bypass",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    const warehouseId = warehouse.warehouseId;
    expect(warehouseId).toBeDefined();

    // 2. Create Site
    const site = await runCommand({
      handler: createSiteCommand,
      input: {
        code: "RVR-01",
        name: "Riverside Processing Mill",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // 3. Create Inventory Item
    const item = await runCommand({
      handler: createInventoryItemCommand,
      input: {
        sku: "SKU-VALVE-50",
        name: "DN50 Safety Relief Valve",
        category: "spare_parts",
        uom: "units",
        reorderLevel: 5,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    const itemId = item.itemId;

    // 4. Record Receipt into Warehouse (10 units)
    await runCommand({
      handler: recordInventoryMovementCommand,
      input: {
        movementNo: "GRN-2026-001",
        kind: "receipt",
        fromLocationKind: "supplier",
        toLocationKind: "warehouse",
        toLocationId: warehouseId,
        lines: [{ itemId, quantity: 10, unitCostMinor: 25000n }],
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // Verify derived stock at warehouse is 10
    const stockWarehouse = await getItemStockAtLocation(testEnv.db, itemId, "warehouse", warehouseId);
    expect(stockWarehouse).toBe(10);

    // 5. Issue 3 units from Warehouse to Site
    await runCommand({
      handler: recordInventoryMovementCommand,
      input: {
        movementNo: "ISS-2026-001",
        kind: "issue_to_site",
        fromLocationKind: "warehouse",
        fromLocationId: warehouseId,
        toLocationKind: "site",
        toLocationId: site.id,
        lines: [{ itemId, quantity: 3 }],
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // Verify derived balances: Warehouse has 7, Site has 3
    const stockWarehouseAfter = await getItemStockAtLocation(testEnv.db, itemId, "warehouse", warehouseId);
    const stockSiteAfter = await getItemStockAtLocation(testEnv.db, itemId, "site", site.id);
    expect(stockWarehouseAfter).toBe(7);
    expect(stockSiteAfter).toBe(3);
  });

  it("M8: Shift roster creation, geofenced attendance check-in, and leave workflow", async () => {
    // 1. Create Site with GPS coords
    const site = await runCommand({
      handler: createSiteCommand,
      input: {
        code: "KRC-05",
        name: "Karachi Edible Oils",
        lat: 24.8607,
        lng: 67.0011,
        geofenceRadiusM: 300,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // 2. Create Employee
    const empId = generateId();
    await testEnv.db.insert(employees).values({
      id: empId,
      orgId,
      employeeNo: "EMP-099",
      name: "Shahid Afridi",
      status: "active",
    });

    // 3. Create Shift
    const shift = await runCommand({
      handler: createShiftCommand,
      input: {
        siteId: site.id,
        name: "Day Shift",
        startsAt: "08:00",
        endsAt: "20:00",
        requiredOperators: 2,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(shift.shiftId).toBeDefined();

    // 4. Record Attendance with GPS Coordinates within geofence (~50m away)
    const att = await runCommand({
      handler: recordAttendanceCommand,
      input: {
        siteId: site.id,
        employeeId: empId,
        shiftId: shift.shiftId,
        kind: "check_in",
        lat: 24.8609,
        lng: 67.0013,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(att.insideGeofence).toBe(true);

    // 5. Submit and Approve Leave Request
    const leave = await runCommand({
      handler: submitLeaveRequestCommand,
      input: {
        employeeId: empId,
        leaveType: "annual",
        startsOn: "2026-04-01",
        endsOn: "2026-04-05",
        reason: "Eid festival holiday",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(leave.status).toBe("pending");

    const approvedLeave = await runCommand({
      handler: approveLeaveRequestCommand,
      input: {
        leaveId: leave.leaveId,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(approvedLeave.status).toBe("approved");
  });
});

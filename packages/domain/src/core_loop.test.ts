import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./test-utils/testDb";
import {
  organizations,
  sites,
  boilers,
  employees,
  accounts,
  vehicles,
  journalEntries,
  journalLines,
  fuelDeliveries,
  expenses,
} from "@stoker/db";
import { eq } from "drizzle-orm";
import { runCommand } from "./shared/runCommand";
import {
  createSiteCommand,
  changeSiteStatusCommand,
} from "./sites/siteCommands";
import {
  registerBoilerCommand,
  moveBoilerCommand,
  recordBoilerReadingCommand,
} from "./boilers/boilerCommands";
import {
  assignEmployeeCommand,
} from "./workforce/workforceCommands";
import {
  issueFloatCommand,
  transferCashCommand,
  getFloatBalance,
} from "./cash/cashCommands";
import {
  submitExpenseCommand,
  approveExpenseCommand,
} from "./expenses/expenseCommands";
import {
  planFuelDeliveryCommand,
  dispatchFuelDeliveryCommand,
  recordFuelArrivalCommand,
  attachDeliveryMediaCommand,
} from "./fuel/fuelCommands";
import { ValidationError } from "./shared/errors";
import { generateId } from "./shared/ids";

describe("M3, M4, M5 Core Operations Loop Integration Tests", () => {
  let testEnv: Awaited<ReturnType<typeof createTestDb>>;

  const orgId = "10000000-0000-0000-0000-000000000001";
  const adminUserId = "30000000-0000-0000-0000-000000000001";
  const opsUserId = "30000000-0000-0000-0000-000000000002";

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

  const opsCtx = {
    actor: {
      userId: opsUserId,
      roles: ["ops_manager" as const],
      siteIds: [],
    },
    orgId,
    now: new Date("2026-10-05T01:00:00Z"),
    source: "console" as const,
  };

  beforeEach(async () => {
    testEnv = await createTestDb();

    // 1. Seed organization
    await testEnv.db.insert(organizations).values({
      id: orgId,
      name: "BioHeat Operations Org",
      currency: "USD",
    });

    // 2. Seed standard chart of accounts
    await testEnv.db.insert(accounts).values([
      {
        id: "40000000-0000-0000-0000-000000000001",
        orgId,
        code: "1010",
        name: "Main Operating Bank",
        type: "asset",
      },
      {
        id: "40000000-0000-0000-0000-000000000002",
        orgId,
        code: "1020",
        name: "Petty Cash Floats",
        type: "asset",
      },
      {
        id: "40000000-0000-0000-0000-000000000003",
        orgId,
        code: "5010",
        name: "Site Maintenance Expense",
        type: "expense",
      },
    ]);
  });

  afterEach(async () => {
    await testEnv.cleanup();
  });

  // -------------------------------------------------------------
  // M3: Sites, Boilers, and Single-Site Workforce
  // -------------------------------------------------------------
  it("M3: Site lifecycle, boiler movement, readings, and single-site employee constraint", async () => {
    // 1. Create a draft site
    const siteResult = await runCommand({
      handler: createSiteCommand,
      input: {
        code: "RVR-01",
        name: "Riverside Processing Mill",
        clientName: "Riverside Agro Corp",
        address: "Industrial Zone East, Plot 14",
        lat: 31.5204,
        lng: 74.3587,
        geofenceRadiusM: 300,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    const siteId = siteResult.id;
    expect(siteId).toBeDefined();

    // 2. Register a boiler in warehouse
    const warehouseId = generateId();
    const boilerResult = await runCommand({
      handler: registerBoilerCommand,
      input: {
        serialNo: "BLR-TH-4000",
        make: "Thermax",
        model: "Combipac 4T",
        capacityValue: 4.0,
        capacityUom: "TPH",
        pressureRatingBar: 10.5,
        fuelTypes: ["rice_husk", "sawdust"],
        locationId: warehouseId,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    const boilerId = boilerResult.id;

    // 3. Move boiler to site
    await runCommand({
      handler: moveBoilerCommand,
      input: {
        boilerId,
        toKind: "site",
        toId: siteId,
        stateAfter: "installed",
        note: "Shipped via low-bed trailer for project startup",
      },
      ctx: opsCtx,
      db: testEnv.db,
    });

    // Verify boiler is now installed at site
    const [boilerRow] = await testEnv.db
      .select()
      .from(boilers)
      .where(eq(boilers.id, boilerId));
    expect(boilerRow?.state).toBe("installed");
    expect(boilerRow?.locationKind).toBe("site");
    expect(boilerRow?.locationId).toBe(siteId);

    // 4. Record boiler reading
    await runCommand({
      handler: recordBoilerReadingCommand,
      input: {
        boilerId,
        siteId,
        runningHours: 135.5,
        steamPressureBar: 8.2,
      },
      ctx: opsCtx,
      db: testEnv.db,
    });

    const [updatedBoiler] = await testEnv.db
      .select()
      .from(boilers)
      .where(eq(boilers.id, boilerId));
    expect(Number(updatedBoiler?.runningHours)).toBe(135.5);

    // 5. Create employees
    const emp1Id = generateId();
    await testEnv.db.insert(employees).values({
      id: emp1Id,
      orgId,
      employeeNo: "EMP-001",
      name: "Tariq Mahmood",
      status: "active",
    });

    // 6. Assign employee as site supervisor
    await runCommand({
      handler: assignEmployeeCommand,
      input: {
        siteId,
        employeeId: emp1Id,
        siteRole: "supervisor",
        startsOn: "2026-02-01",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // 7. Test Single-Site Constraint: Create 2nd site and attempt to assign Tariq concurrently
    const site2 = await runCommand({
      handler: createSiteCommand,
      input: {
        code: "HLD-02",
        name: "Highland Biofuels Plant",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    await expect(
      runCommand({
        handler: assignEmployeeCommand,
        input: {
          siteId: site2.id,
          employeeId: emp1Id,
          siteRole: "operator",
          startsOn: "2026-02-15",
        },
        ctx: adminCtx,
        db: testEnv.db,
      })
    ).rejects.toThrow(ValidationError);

    // 8. Change site status to active (guard checks boiler + active supervisor present)
    const activeResult = await runCommand({
      handler: changeSiteStatusCommand,
      input: {
        siteId,
        targetStatus: "active",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(activeResult.status).toBe("active");

    const [siteRow] = await testEnv.db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId));
    expect(siteRow?.status).toBe("active");
  });

  // -------------------------------------------------------------
  // M4: Ledger, Cash Floats, and Expenses
  // -------------------------------------------------------------
  it("M4: Cash float issuance, double-entry balanced posting, expense lifecycle, and derived float balances", async () => {
    // 1. Setup site and custodian employee
    const site = await runCommand({
      handler: createSiteCommand,
      input: { code: "KRC-03", name: "Karachi Port Site" },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // Also register and install boiler on site for running expenses
    const warehouseId = generateId();
    const boiler = await runCommand({
      handler: registerBoilerCommand,
      input: {
        serialNo: "BLR-KP-100",
        make: "Thermax",
        model: "Pac 2T",
        capacityValue: 2.0,
        pressureRatingBar: 8.0,
        fuelTypes: ["rice_husk"],
        locationId: warehouseId,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    const custodianId = generateId();
    await testEnv.db.insert(employees).values({
      id: custodianId,
      orgId,
      employeeNo: "EMP-002",
      name: "Ali Asghar",
      status: "active",
    });

    const bankAccountId = "40000000-0000-0000-0000-000000000001";
    const floatAccountId = "40000000-0000-0000-0000-000000000002";
    const expenseAccountId = "40000000-0000-0000-0000-000000000003";

    // 2. Issue Cash Float of $1,000.00 (100,000 cents)
    const floatResult = await runCommand({
      handler: issueFloatCommand,
      input: {
        siteId: site.id,
        custodianId,
        accountId: floatAccountId,
        bankAccountId,
        amountMinor: 100000n, // $1,000.00
        currency: "USD",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    const floatId = floatResult.floatId;
    expect(floatId).toBeDefined();

    // Verify derived float balance is 100,000
    const initialBalance = await getFloatBalance(testEnv.db, floatId);
    expect(initialBalance).toBe(100000n);

    // Verify double-entry ledger entry was created and balances perfectly
    const [entry] = await testEnv.db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.sourceId, floatId));
    expect(entry).toBeDefined();

    const lines = await testEnv.db
      .select()
      .from(journalLines)
      .where(eq(journalLines.entryId, entry!.id));
    expect(lines.length).toBe(2);

    const totalDebits = lines.reduce((s, l) => s + BigInt(l.debitMinor), 0n);
    const totalCredits = lines.reduce((s, l) => s + BigInt(l.creditMinor), 0n);
    expect(totalDebits).toBe(100000n);
    expect(totalCredits).toBe(100000n);
    expect(totalDebits === totalCredits).toBe(true);

    // 3. Setup expense category
    const categoryId = generateId();
    await testEnv.client.exec(`
      INSERT INTO expense_categories (id, org_id, code, name, account_id)
      VALUES ('${categoryId}', '${orgId}', 'MAINT', 'Routine Maintenance', '${expenseAccountId}')
    `);

    const supervisorCtx = {
      actor: {
        userId: custodianId,
        roles: ["site_supervisor" as const],
        siteIds: [site.id],
      },
      orgId,
      now: new Date("2026-10-05T01:00:00Z"),
      source: "field" as const,
    };

    const financeCtx = {
      actor: {
        userId: adminUserId,
        roles: ["finance" as const],
        siteIds: [],
      },
      orgId,
      now: new Date("2026-10-05T01:00:00Z"),
      source: "console" as const,
    };

    // 4. Submit an expense of $150.00 (15,000 cents) from the float
    const expenseSub = await runCommand({
      handler: submitExpenseCommand,
      input: {
        kind: "running",
        siteId: site.id,
        boilerId: boiler.id,
        employeeId: custodianId,
        categoryId,
        amountMinor: 15000n,
        currency: "USD",
        paymentSource: "float",
        floatId,
        spentOn: "2026-03-01",
        description: "Replaced water pressure relief valve gasket",
      },
      ctx: supervisorCtx,
      db: testEnv.db,
    });
    const expenseId = expenseSub.expenseId;

    // 5. Approve the expense
    await runCommand({
      handler: approveExpenseCommand,
      input: {
        expenseId,
      },
      ctx: financeCtx,
      db: testEnv.db,
    });

    const [expRow] = await testEnv.db
      .select()
      .from(expenses)
      .where(eq(expenses.id, expenseId));
    expect(expRow?.status).toBe("approved");

    // 6. Verify float balance was deducted: 100,000 - 15,000 = 85,000 cents
    const postExpenseBalance = await getFloatBalance(testEnv.db, floatId);
    expect(postExpenseBalance).toBe(85000n);

    // 7. Verify journal entry for the expense balances Dr Expense 15,000 / Cr Float 15,000
    const [expenseJournal] = await testEnv.db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.sourceId, expenseId));
    expect(expenseJournal).toBeDefined();

    const expLines = await testEnv.db
      .select()
      .from(journalLines)
      .where(eq(journalLines.entryId, expenseJournal!.id));
    const expDebits = expLines.reduce((s, l) => s + BigInt(l.debitMinor), 0n);
    const expCredits = expLines.reduce((s, l) => s + BigInt(l.creditMinor), 0n);
    expect(expDebits).toBe(15000n);
    expect(expCredits).toBe(15000n);

    // 8. Test Cash Handover / Transfer
    const receiverId = generateId();
    await testEnv.db.insert(employees).values({
      id: receiverId,
      orgId,
      employeeNo: "EMP-003",
      name: "Zubair Khan",
      status: "active",
    });

    const targetFloat = await runCommand({
      handler: issueFloatCommand,
      input: {
        siteId: site.id,
        custodianId: receiverId,
        accountId: floatAccountId,
        bankAccountId,
        amountMinor: 20000n,
        currency: "USD",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    await runCommand({
      handler: transferCashCommand,
      input: {
        fromFloatId: floatId,
        toFloatId: targetFloat.floatId,
        amountMinor: 10000n,
        currency: "USD",
      },
      ctx: supervisorCtx,
      db: testEnv.db,
    });

    const sourceAfterTransfer = await getFloatBalance(testEnv.db, floatId);
    const targetAfterTransfer = await getFloatBalance(testEnv.db, targetFloat.floatId);
    expect(sourceAfterTransfer).toBe(75000n); // 85,000 - 10,000
    expect(targetAfterTransfer).toBe(30000n); // 20,000 + 10,000
  });

  // -------------------------------------------------------------
  // M5: Fuel Logistics & Tamper-Evident Proof
  // -------------------------------------------------------------
  it("M5: Fuel dispatch, arrival verification with auto-dispute (>2% shortfall), and SHA-256 geofenced media", async () => {
    // 1. Create site with GPS coordinates
    const site = await runCommand({
      handler: createSiteCommand,
      input: {
        code: "FSD-05",
        name: "Faisalabad Textile Hub",
        lat: 31.4187,
        lng: 73.0791,
        geofenceRadiusM: 400,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // 2. Create vehicle and driver
    const vehicleId = generateId();
    await testEnv.db.insert(vehicles).values({
      id: vehicleId,
      orgId,
      plateNumber: "LES-9921",
      model: "Hino 500 Super Dolphin",
      capacityKg: "15000.000",
      status: "active",
    });

    const driverId = generateId();
    await testEnv.db.insert(employees).values({
      id: driverId,
      orgId,
      employeeNo: "DRV-001",
      name: "Rasheed Ahmed",
      status: "active",
    });

    // 3. Plan & Dispatch Delivery: 10,000 kg rice husk
    const plan = await runCommand({
      handler: planFuelDeliveryCommand,
      input: {
        code: "DEL-FSD-001",
        sourceKind: "supplier",
        siteId: site.id,
        vehicleId,
        driverId,
        fuelType: "rice_husk",
        plannedQtyKg: 10000,
        tolerancePct: 2.0,
      },
      ctx: opsCtx,
      db: testEnv.db,
    });
    const deliveryId = plan.deliveryId;

    await runCommand({
      handler: dispatchFuelDeliveryCommand,
      input: {
        deliveryId,
        dispatchedQtyKg: 10000,
      },
      ctx: opsCtx,
      db: testEnv.db,
    });

    // 4. Arrival Scenario with Shortfall > 2%:
    // Received only 9,500 kg (5% loss, exceeds 2% tolerance threshold)
    const arrivalResult = await runCommand({
      handler: recordFuelArrivalCommand,
      input: {
        deliveryId,
        receivedQtyKg: 9500,
      },
      ctx: opsCtx,
      db: testEnv.db,
    });

    // Verify auto-disputed status
    expect(arrivalResult.status).toBe("disputed");

    const [delivRow] = await testEnv.db
      .select()
      .from(fuelDeliveries)
      .where(eq(fuelDeliveries.id, deliveryId));
    expect(delivRow?.status).toBe("disputed");

    // 5. Attach tamper-evident media with Haversine GPS geofence computation
    // Site is at 31.4187, 73.0791.
    // Photo captured ~150 meters away: 31.4199, 73.0795
    const mediaResult = await runCommand({
      handler: attachDeliveryMediaCommand,
      input: {
        deliveryId,
        purpose: "weighbridge_slip",
        mediaType: "image",
        objectKey: "proof/2026/03/weightbridge_9921.jpg",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        capturedAt: "2026-03-02T10:00:00Z",
        lat: 31.4199,
        lng: 73.0795,
        accuracyM: 5.0,
      },
      ctx: opsCtx,
      db: testEnv.db,
    });

    expect(mediaResult.insideGeofence).toBe(true);
    expect(mediaResult.distanceM).toBeLessThan(400); // inside 400m geofence radius
  });
});

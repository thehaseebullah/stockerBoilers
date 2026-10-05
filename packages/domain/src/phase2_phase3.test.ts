import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./test-utils/testDb";
import { organizations, employees, boilers, sites, cashFloats, accounts } from "@stoker/db";
import { runCommand } from "./shared/runCommand";
import {
  scheduleMaintenanceCommand,
  completeMaintenanceCommand,
  recordCertificateCommand,
} from "./boilers/maintenanceCommands";
import {
  runPayrollCommand,
  checkShiftCoverage,
} from "./hr/payrollCommands";
import {
  lockPeriodCommand,
  recordManualJournalCommand,
  generateTrialBalance,
} from "./ledger/financialControls";
import { generateClientInvoiceCommand } from "./sites/clientInvoicing";
import { ingestTelemetryCommand } from "./boilers/iotTelemetry";
import {
  requestFloatTopUpCommand,
  approveFloatTopUpCommand,
  scanSystemAlerts,
} from "./alerts/alertsEngine";
import { createSiteCommand } from "./sites/siteCommands";
import { registerBoilerCommand } from "./boilers/boilerCommands";
import { generateId } from "./shared/ids";

describe("Phase 2 & Phase 3 Integration Tests (Maintenance, Payroll, Controls, Invoicing, IoT)", () => {
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

  it("M11 & M12: Maintenance scheduling, certificate tracking, and automated alert scanning", async () => {
    // 1. Create a site and register a boiler
    const site = await runCommand({
      handler: createSiteCommand,
      input: {
        code: "SIT-99",
        name: "North Refinery Site",
        clientName: "North Agro",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    const boiler = await runCommand({
      handler: registerBoilerCommand,
      input: {
        serialNo: "BLR-TEST-99",
        make: "Thermax",
        model: "SteamMax 500",
        capacityValue: 5000,
        pressureRatingBar: 16,
        fuelTypes: ["rice_husk", "wood_chips"],
        locationId: site.id,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // 2. Schedule and complete maintenance
    const mnt = await runCommand({
      handler: scheduleMaintenanceCommand,
      input: {
        boilerId: boiler.id,
        title: "500-Hour Burner Nozzle Service",
        maintenanceType: "preventative",
        scheduledDate: "2026-10-10",
        technician: "Kamran Akmal",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(mnt.id).toBeDefined();

    const mntDone = await runCommand({
      handler: completeMaintenanceCommand,
      input: {
        maintenanceId: mnt.id,
        runningHoursAtService: 520,
        costMinor: 15000n,
        notes: "Replaced gaskets and cleaned burner nozzle.",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(mntDone.id).toBe(mnt.id);

    // 3. Record safety certificate expiring soon
    const cert = await runCommand({
      handler: recordCertificateCommand,
      input: {
        boilerId: boiler.id,
        certificateType: "pressure_vessel",
        certificateNumber: "PV-2026-9901",
        issuedBy: "Boiler Inspection Authority",
        issuedAt: "2025-10-20",
        expiresAt: "2026-10-25", // 20 days away
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(cert.id).toBeDefined();

    // 4. Scan alerts - should detect the expiring certificate
    const alerts = await scanSystemAlerts(testEnv.db, orgId);
    expect(alerts.some((a) => a.category === "maintenance" && a.entityId === boiler.id)).toBe(true);
  });

  it("M11 & M12: HR payroll rollup, financial period locking, and balanced manual journals", async () => {
    // 1. Create employee
    const empId = generateId();
    await testEnv.db.insert(employees).values({
      id: empId,
      orgId,
      employeeNo: "EMP-001",
      name: "Tariq Mahmood",
      status: "active",
    });

    // 2. Run payroll
    const payroll = await runCommand({
      handler: runPayrollCommand,
      input: {
        periodMonth: "2026-10",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(payroll.totalEmployees).toBe(1);
    expect(BigInt(payroll.totalGrossMinor)).toBeGreaterThan(0n);
    expect(BigInt(payroll.totalNetMinor)).toBeGreaterThan(0n);

    // 3. Create chart of accounts
    const accCashId = generateId();
    const accMaintId = generateId();
    await testEnv.db.insert(accounts).values([
      { id: accCashId, orgId, code: "1010", name: "Bank Cash", type: "asset" },
      { id: accMaintId, orgId, code: "5010", name: "Maintenance Expense", type: "expense" },
    ]);

    // 4. Record balanced manual journal
    const journal = await runCommand({
      handler: recordManualJournalCommand,
      input: {
        effectiveDate: "2026-10-05",
        narration: "Adjustment for emergency boiler welding service",
        lines: [
          { accountId: accMaintId, debitMinor: 25000n, creditMinor: 0n },
          { accountId: accCashId, debitMinor: 0n, creditMinor: 25000n },
        ],
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(journal.id).toBeDefined();

    // 5. Generate trial balance
    const trialBalance = await generateTrialBalance(testEnv.db, orgId);
    expect(trialBalance.length).toBeGreaterThanOrEqual(2);

    // 6. Lock period
    const locked = await runCommand({
      handler: lockPeriodCommand,
      input: {
        periodName: "2026-09",
        startsOn: "2026-09-01",
        endsOn: "2026-09-30",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(locked.periodName).toBe("2026-09");
  });

  it("Phase 3: Client invoicing and real-time IoT telemetry ingestion", async () => {
    // 1. Create Site
    const site = await runCommand({
      handler: createSiteCommand,
      input: {
        code: "SIT-INV",
        name: "BioEnergy Textile Mill",
        clientName: "Textile Holdings Ltd",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    // 2. Generate Client Invoice
    const invoice = await runCommand({
      handler: generateClientInvoiceCommand,
      input: {
        siteId: site.id,
        periodStart: "2026-10-01",
        periodEnd: "2026-10-31",
        billingModel: "flat_monthly",
        rateMinor: 500000n, // $5,000.00
        dueDate: "2026-11-10",
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(invoice.invoiceNo).toContain("INV-SIT-INV");
    expect(invoice.totalMinor).toBe("575000"); // $5,000 + 15% tax

    // 3. Register boiler & Ingest IoT telemetry
    const boiler = await runCommand({
      handler: registerBoilerCommand,
      input: {
        serialNo: "BLR-IOT-01",
        make: "Thermax",
        model: "Titan Steam",
        capacityValue: 8000,
        pressureRatingBar: 18,
        fuelTypes: ["biomass_pellets"],
        locationId: site.id,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });

    const telemetry = await runCommand({
      handler: ingestTelemetryCommand,
      input: {
        boilerId: boiler.id,
        steamPressureBar: 14.8,
        flueGasTempC: 185.5,
        waterLevelPct: 78.2,
        fuelFeedKgH: 420.0,
        vibrationMmS: 1.2,
      },
      ctx: adminCtx,
      db: testEnv.db,
    });
    expect(telemetry.id).toBeDefined();
  });
});

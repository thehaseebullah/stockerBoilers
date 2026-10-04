import { Database } from "./client";
import { organizations, users, userRoles, userSiteScopes, sites } from "./schema";

export const LIVE_ORG_ID = "10000000-0000-0000-0000-000000000001";
export const SANDBOX_ORG_ID = "00000000-0000-0000-0000-000000000000";

export const SITE_RIVERSIDE_ID = "20000000-0000-0000-0000-000000000001";
export const SITE_HIGHLAND_ID = "20000000-0000-0000-0000-000000000002";
export const SITE_VALLEY_ID = "20000000-0000-0000-0000-000000000003";

export const USER_ADMIN_ID = "30000000-0000-0000-0000-000000000001";
export const USER_SUPERVISOR_ID = "30000000-0000-0000-0000-000000000002";
export const USER_OPERATOR_ID = "30000000-0000-0000-0000-000000000003";
export const USER_FINANCE_ID = "30000000-0000-0000-0000-000000000004";

export async function seedDatabase(db: Database) {
  // Organizations
  await db.insert(organizations).values([
    {
      id: LIVE_ORG_ID,
      name: "Stoker Energy Operations Ltd",
      currency: "USD",
      isSandbox: false,
    },
    {
      id: SANDBOX_ORG_ID,
      name: "Stoker Simulation Sandbox",
      currency: "USD",
      isSandbox: true,
    },
  ]).onConflictDoNothing();

  // Sites (Live)
  await db.insert(sites).values([
    {
      id: SITE_RIVERSIDE_ID,
      orgId: LIVE_ORG_ID,
      code: "RVR-01",
      name: "Riverside Mill",
      clientName: "Riverside Paper & Pulp",
      address: "Plot 14, Riverside Industrial Area",
      lat: 31.5204,
      lng: 74.3587,
      geofenceRadiusM: 300,
      status: "active",
    },
    {
      id: SITE_HIGHLAND_ID,
      orgId: LIVE_ORG_ID,
      code: "HLD-02",
      name: "Highland Timber",
      clientName: "Highland Agro Ltd",
      address: "Sector 8, Timber Market",
      lat: 31.5500,
      lng: 74.4000,
      geofenceRadiusM: 300,
      status: "active",
    },
    {
      id: SITE_VALLEY_ID,
      orgId: LIVE_ORG_ID,
      code: "VLY-03",
      name: "Valley Processing",
      clientName: "Valley Grains Corp",
      address: "Highway 4, Valley Interchange",
      lat: 31.6000,
      lng: 74.3000,
      geofenceRadiusM: 400,
      status: "draft",
    },
  ]).onConflictDoNothing();

  // Users
  await db.insert(users).values([
    {
      id: USER_ADMIN_ID,
      orgId: LIVE_ORG_ID,
      email: "admin@stoker.local",
      name: "Arthur Pendelton (Admin)",
    },
    {
      id: USER_FINANCE_ID,
      orgId: LIVE_ORG_ID,
      email: "finance@stoker.local",
      name: "Fiona Gallagher (Finance)",
    },
    {
      id: USER_SUPERVISOR_ID,
      orgId: LIVE_ORG_ID,
      email: "supervisor@riverside.local",
      name: "Samir Khan (Supervisor)",
    },
    {
      id: USER_OPERATOR_ID,
      orgId: LIVE_ORG_ID,
      email: "operator@riverside.local",
      name: "Tariq Mahmood (Operator)",
    },
  ]).onConflictDoNothing();

  // User roles
  await db.insert(userRoles).values([
    { userId: USER_ADMIN_ID, role: "admin" },
    { userId: USER_FINANCE_ID, role: "finance" },
    { userId: USER_SUPERVISOR_ID, role: "site_supervisor" },
    { userId: USER_OPERATOR_ID, role: "site_operator" },
  ]).onConflictDoNothing();

  // User site scopes (Supervisor and Operator scoped ONLY to Riverside Mill)
  await db.insert(userSiteScopes).values([
    { userId: USER_SUPERVISOR_ID, siteId: SITE_RIVERSIDE_ID },
    { userId: USER_OPERATOR_ID, siteId: SITE_RIVERSIDE_ID },
  ]).onConflictDoNothing();
}

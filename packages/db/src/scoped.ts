import { eq, inArray, and, SQL } from "drizzle-orm";
import { Role } from "@stoker/contracts";
import { sites } from "./schema";

export interface ScopedContext {
  orgId: string;
  actor: {
    userId: string;
    roles: Role[];
    siteIds: string[];
  };
}

const HEAD_OFFICE_ROLES: ReadonlySet<Role> = new Set<Role>([
  "admin",
  "ops_manager",
  "finance",
  "hr_manager",
  "warehouse_manager",
  "auditor",
]);

/**
 * Builds site-scoping where conditions for Drizzle queries (ARCHITECTURE §13)
 */
export function buildSiteScopeCondition(ctx: ScopedContext): SQL {
  const isHeadOffice = ctx.actor.roles.some((r) => HEAD_OFFICE_ROLES.has(r));

  if (isHeadOffice) {
    return eq(sites.orgId, ctx.orgId);
  }

  if (ctx.actor.siteIds.length === 0) {
    // User has no assigned sites -> return condition matching no sites
    return and(eq(sites.orgId, ctx.orgId), inArray(sites.id, ["00000000-0000-0000-0000-000000000000"]))!;
  }

  return and(
    eq(sites.orgId, ctx.orgId),
    inArray(sites.id, ctx.actor.siteIds)
  )!;
}

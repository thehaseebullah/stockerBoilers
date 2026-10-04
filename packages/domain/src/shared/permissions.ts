import { Role } from "@stoker/contracts";
import { ForbiddenError } from "./errors";
import { CommandContext } from "./command";

export type Permission =
  | "site.create"
  | "site.update"
  | "site.change_status"
  | "site.view"
  | "boiler.register"
  | "boiler.move"
  | "boiler.record_reading"
  | "boiler.view"
  | "workforce.assign"
  | "workforce.view"
  | "expense.submit"
  | "expense.approve"
  | "expense.reject"
  | "expense.view"
  | "cash.request"
  | "cash.issue"
  | "cash.transfer"
  | "cash.settle"
  | "cash.view"
  | "fuel.plan"
  | "fuel.dispatch"
  | "fuel.record_arrival"
  | "fuel.verify"
  | "fuel.dispute"
  | "fuel.view"
  | "inventory.move"
  | "inventory.view"
  | "ledger.post"
  | "ledger.view"
  | "hr.check_in"
  | "hr.roster_manage"
  | "hr.leave_request"
  | "hr.payroll_run"
  | "audit.view";

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: [
    "site.create", "site.update", "site.change_status", "site.view",
    "boiler.register", "boiler.move", "boiler.record_reading", "boiler.view",
    "workforce.assign", "workforce.view",
    "expense.submit", "expense.approve", "expense.reject", "expense.view",
    "cash.request", "cash.issue", "cash.transfer", "cash.settle", "cash.view",
    "fuel.plan", "fuel.dispatch", "fuel.record_arrival", "fuel.verify", "fuel.dispute", "fuel.view",
    "inventory.move", "inventory.view",
    "ledger.post", "ledger.view",
    "hr.check_in", "hr.roster_manage", "hr.leave_request", "hr.payroll_run",
    "audit.view"
  ],
  ops_manager: [
    "site.create", "site.update", "site.change_status", "site.view",
    "boiler.register", "boiler.move", "boiler.record_reading", "boiler.view",
    "workforce.assign", "workforce.view",
    "expense.view", "cash.view",
    "fuel.plan", "fuel.dispatch", "fuel.record_arrival", "fuel.verify", "fuel.dispute", "fuel.view",
    "inventory.view", "ledger.view"
  ],
  finance: [
    "site.view", "boiler.view",
    "expense.approve", "expense.reject", "expense.view",
    "cash.request", "cash.issue", "cash.transfer", "cash.settle", "cash.view",
    "fuel.verify", "fuel.dispute", "fuel.view",
    "inventory.view",
    "ledger.post", "ledger.view"
  ],
  hr_manager: [
    "site.view",
    "workforce.assign", "workforce.view",
    "hr.check_in", "hr.roster_manage", "hr.leave_request", "hr.payroll_run"
  ],
  warehouse_manager: [
    "site.view",
    "boiler.move", "boiler.view",
    "fuel.dispatch", "fuel.view",
    "inventory.move", "inventory.view"
  ],
  site_supervisor: [
    "site.view",
    "boiler.view", "boiler.record_reading",
    "workforce.view",
    "expense.submit", "expense.approve", "expense.view",
    "cash.transfer", "cash.view",
    "fuel.record_arrival", "fuel.view",
    "hr.check_in"
  ],
  site_operator: [
    "site.view",
    "boiler.view", "boiler.record_reading",
    "expense.submit", "expense.view",
    "fuel.record_arrival", "fuel.view",
    "hr.check_in"
  ],
  driver: [
    "fuel.dispatch", "fuel.record_arrival", "fuel.view"
  ],
  auditor: [
    "site.view", "boiler.view", "workforce.view", "expense.view",
    "cash.view", "fuel.view", "inventory.view", "ledger.view",
    "audit.view"
  ],
};

const HEAD_OFFICE_ROLES: ReadonlySet<Role> = new Set<Role>([
  "admin",
  "ops_manager",
  "finance",
  "hr_manager",
  "warehouse_manager",
  "auditor"
]);

export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
}

export function assertPermission(roles: Role[], permission: Permission): void {
  if (!hasPermission(roles, permission)) {
    throw new ForbiddenError(`Missing required permission: ${permission}`);
  }
}

/**
 * Asserts that the site is in the actor's scope (ARCHITECTURE §13)
 */
export function assertSiteInScope(ctx: CommandContext, siteId: string): void {
  const isHeadOffice = ctx.actor.roles.some((r) => HEAD_OFFICE_ROLES.has(r));
  if (isHeadOffice) {
    return;
  }
  if (!ctx.actor.siteIds.includes(siteId)) {
    throw new ForbiddenError(`Site ${siteId} is not in user's assigned scope`, "SITE_NOT_IN_SCOPE");
  }
}

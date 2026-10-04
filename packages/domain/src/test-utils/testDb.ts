import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@stoker/db";

export async function createTestDb() {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  await client.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      currency text NOT NULL DEFAULT 'USD',
      is_sandbox boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      email text NOT NULL UNIQUE,
      name text NOT NULL,
      password_hash text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role text NOT NULL,
      PRIMARY KEY (user_id, role)
    );

    CREATE TABLE IF NOT EXISTS user_site_scopes (
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      site_id uuid NOT NULL,
      PRIMARY KEY (user_id, site_id)
    );

    CREATE TABLE IF NOT EXISTS sites (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      code text NOT NULL,
      name text NOT NULL,
      client_name text,
      address text,
      lat double precision,
      lng double precision,
      geofence_radius_m int NOT NULL DEFAULT 300,
      status text NOT NULL DEFAULT 'draft',
      contract_start text,
      contract_end text,
      created_at timestamptz NOT NULL DEFAULT now(),
      created_by uuid,
      updated_at timestamptz,
      updated_by uuid
    );

    CREATE TABLE IF NOT EXISTS boilers (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      serial_no text NOT NULL,
      make text,
      model text,
      capacity_value numeric(10,2),
      capacity_uom text,
      pressure_rating_bar numeric(6,2),
      fuel_types jsonb NOT NULL,
      state text NOT NULL DEFAULT 'in_warehouse',
      location_kind text NOT NULL DEFAULT 'warehouse',
      location_id uuid NOT NULL,
      running_hours numeric(12,1) NOT NULL DEFAULT 0,
      purchase_cost_minor bigint,
      currency text DEFAULT 'USD',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz
    );

    CREATE TABLE IF NOT EXISTS boiler_movements (
      id uuid PRIMARY KEY,
      boiler_id uuid NOT NULL REFERENCES boilers(id),
      from_kind text,
      from_id uuid,
      to_kind text NOT NULL,
      to_id uuid NOT NULL,
      state_after text NOT NULL,
      moved_at timestamptz NOT NULL DEFAULT now(),
      actor_id uuid NOT NULL,
      note text
    );

    CREATE TABLE IF NOT EXISTS boiler_readings (
      id uuid PRIMARY KEY,
      boiler_id uuid NOT NULL REFERENCES boilers(id),
      site_id uuid NOT NULL REFERENCES sites(id),
      running_hours numeric(12,1) NOT NULL,
      steam_pressure_bar numeric(6,2),
      recorded_at timestamptz NOT NULL DEFAULT now(),
      recorded_by uuid NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employees (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      user_id uuid REFERENCES users(id),
      employee_no text NOT NULL,
      name text NOT NULL,
      phone text,
      status text NOT NULL DEFAULT 'active',
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS site_assignments (
      id uuid PRIMARY KEY,
      site_id uuid NOT NULL REFERENCES sites(id),
      employee_id uuid NOT NULL REFERENCES employees(id),
      site_role text NOT NULL,
      starts_on text NOT NULL,
      ends_on text
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      code text NOT NULL,
      name text NOT NULL,
      type text NOT NULL,
      parent_id uuid,
      dimension_type text,
      dimension_id uuid
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      entry_no bigserial,
      posted_at timestamptz NOT NULL DEFAULT now(),
      effective_date text NOT NULL,
      source_type text NOT NULL,
      source_id uuid NOT NULL,
      narration text,
      reverses_id uuid
    );

    CREATE TABLE IF NOT EXISTS journal_lines (
      id uuid PRIMARY KEY,
      entry_id uuid NOT NULL REFERENCES journal_entries(id),
      account_id uuid NOT NULL REFERENCES accounts(id),
      debit_minor bigint NOT NULL DEFAULT 0,
      credit_minor bigint NOT NULL DEFAULT 0,
      site_id uuid,
      employee_id uuid,
      boiler_id uuid,
      vendor_id uuid
    );

    CREATE TABLE IF NOT EXISTS cash_floats (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      site_id uuid REFERENCES sites(id),
      custodian_id uuid NOT NULL REFERENCES employees(id),
      account_id uuid NOT NULL REFERENCES accounts(id),
      currency text NOT NULL DEFAULT 'USD',
      min_balance_minor bigint NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS cash_float_txns (
      id uuid PRIMARY KEY,
      float_id uuid NOT NULL REFERENCES cash_floats(id),
      kind text NOT NULL,
      amount_minor bigint NOT NULL,
      source_type text,
      source_id uuid,
      occurred_at timestamptz NOT NULL DEFAULT now(),
      captured_at timestamptz,
      actor_id uuid NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expense_categories (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      code text NOT NULL,
      name text NOT NULL,
      account_id uuid NOT NULL REFERENCES accounts(id)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      kind text NOT NULL,
      site_id uuid NOT NULL REFERENCES sites(id),
      boiler_id uuid REFERENCES boilers(id),
      employee_id uuid NOT NULL REFERENCES employees(id),
      category_id uuid NOT NULL REFERENCES expense_categories(id),
      amount_minor bigint NOT NULL,
      currency text NOT NULL DEFAULT 'USD',
      payment_source text NOT NULL,
      float_id uuid REFERENCES cash_floats(id),
      spent_on text NOT NULL,
      description text,
      status text NOT NULL DEFAULT 'submitted',
      captured_at timestamptz NOT NULL DEFAULT now(),
      received_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      plate_number text NOT NULL,
      model text,
      capacity_kg numeric(14,3),
      status text NOT NULL DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS fuel_deliveries (
      id uuid PRIMARY KEY,
      org_id uuid NOT NULL REFERENCES organizations(id),
      code text NOT NULL,
      source_kind text NOT NULL,
      site_id uuid NOT NULL REFERENCES sites(id),
      vehicle_id uuid NOT NULL REFERENCES vehicles(id),
      driver_id uuid REFERENCES employees(id),
      fuel_type text NOT NULL DEFAULT 'rice_husk',
      planned_qty_kg numeric(14,3) NOT NULL,
      dispatched_qty_kg numeric(14,3),
      received_qty_kg numeric(14,3),
      tolerance_pct numeric(5,2) NOT NULL DEFAULT 2.0,
      status text NOT NULL DEFAULT 'planned',
      dispatched_at timestamptz,
      arrived_at timestamptz
    );

    CREATE TABLE IF NOT EXISTS delivery_media (
      id uuid PRIMARY KEY,
      delivery_id uuid NOT NULL REFERENCES fuel_deliveries(id),
      purpose text NOT NULL,
      media_type text NOT NULL,
      object_key text NOT NULL,
      sha256 text NOT NULL,
      bytes bigint,
      captured_at timestamptz NOT NULL,
      lat double precision,
      lng double precision,
      accuracy_m double precision,
      distance_from_site_m double precision,
      inside_geofence boolean DEFAULT true,
      captured_by uuid NOT NULL,
      processing_state text NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS domain_events (
      id bigserial PRIMARY KEY,
      org_id uuid NOT NULL,
      type text NOT NULL,
      aggregate_type text NOT NULL,
      aggregate_id uuid NOT NULL,
      payload jsonb NOT NULL,
      actor_id uuid,
      source text NOT NULL,
      trace_id text,
      occurred_at timestamptz NOT NULL DEFAULT now(),
      is_sandbox boolean NOT NULL DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS processed_commands (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      actor_id uuid NOT NULL,
      result jsonb NOT NULL,
      processed_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id bigserial PRIMARY KEY,
      org_id uuid NOT NULL,
      actor_id uuid,
      action text NOT NULL,
      entity_type text NOT NULL,
      entity_id uuid NOT NULL,
      before jsonb,
      after jsonb,
      ip text,
      user_agent text,
      at timestamptz NOT NULL DEFAULT now()
    );
  `);

  return {
    client,
    db,
    async cleanup() {
      await client.close();
    },
  };
}

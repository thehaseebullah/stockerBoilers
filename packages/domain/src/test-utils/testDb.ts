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

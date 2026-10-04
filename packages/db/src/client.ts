import { drizzle } from "drizzle-orm/postgres-js";
import { PgTransaction } from "drizzle-orm/pg-core";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://stoker:stoker_secret@localhost:5432/stoker";

// Client for queries
export const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
// Generic transaction type compatible with any PostgreSQL driver (postgres-js, pglite, etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- reason: Drizzle PgTransaction HKT parameterization across drivers
export type DbTransaction = PgTransaction<any, any, any>;

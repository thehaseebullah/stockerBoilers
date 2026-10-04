import Dexie, { type EntityTable } from "dexie";
import { uuidv7 } from "uuidv7";
import { FieldCommand } from "@stoker/contracts";

export interface OutboxItem extends FieldCommand {
  attempts: number;
  lastError?: string;
  status: "pending" | "syncing" | "synced" | "rejected";
  createdAt: number;
}

export interface MediaItem {
  id: string;
  commandId?: string;
  deliveryId?: string;
  purpose: string;
  blob: Blob;
  sha256: string;
  capturedAt: Date;
  status: "pending" | "uploading" | "uploaded" | "failed";
}

export class FieldDatabase extends Dexie {
  outbox!: EntityTable<OutboxItem, "id">;
  media!: EntityTable<MediaItem, "id">;

  constructor() {
    super("StokerFieldDB");
    this.version(1).stores({
      outbox: "id, status, capturedAt, createdAt",
      media: "id, commandId, deliveryId, status, capturedAt",
    });
  }
}

export const fieldDb = new FieldDatabase();

/**
 * Checks whether the browser / device is currently online
 */
export function isOnline(): boolean {
  if (typeof navigator !== "undefined" && "onLine" in navigator) {
    return navigator.onLine;
  }
  return true;
}

/**
 * Calculates SHA-256 hex digest for a Blob/File
 */
export async function calculateBlobSha256(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Enqueues a command into local IndexedDB outbox with a UUIDv7
 */
export async function enqueueFieldCommand(params: {
  name: string;
  payload: Record<string, unknown>;
  capturedAt?: Date;
}): Promise<OutboxItem> {
  const item: OutboxItem = {
    id: uuidv7(),
    name: params.name,
    payload: params.payload,
    capturedAt: params.capturedAt ?? new Date(),
    source: "field",
    attempts: 0,
    status: "pending",
    createdAt: Date.now(),
  };

  await fieldDb.outbox.put(item);
  return item;
}

/**
 * Returns count of commands waiting in local outbox
 */
export async function getPendingOutboxCount(): Promise<number> {
  return await fieldDb.outbox.where("status").equals("pending").count();
}

/**
 * Drains local outbox by sending queued commands to the batch API
 */
export async function drainOutbox(options?: {
  apiBaseUrl?: string;
  fetchFn?: typeof fetch;
}): Promise<{ synced: number; failed: number }> {
  if (!isOnline()) {
    return { synced: 0, failed: 0 };
  }

  const fetchImpl = options?.fetchFn ?? (typeof fetch !== "undefined" ? fetch : undefined);
  if (!fetchImpl) {
    return { synced: 0, failed: 0 };
  }

  const pendingItems = await fieldDb.outbox
    .where("status")
    .equals("pending")
    .sortBy("createdAt");

  if (pendingItems.length === 0) {
    return { synced: 0, failed: 0 };
  }

  let synced = 0;
  let failed = 0;

  for (const item of pendingItems) {
    try {
      await fieldDb.outbox.update(item.id, { status: "syncing" });

      const url = `${options?.apiBaseUrl ?? ""}/api/v1/commands`;
      const response = await fetchImpl(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          name: item.name,
          payload: item.payload,
          capturedAt: item.capturedAt.toISOString(),
          source: "field",
        }),
      });

      if (response.ok) {
        await fieldDb.outbox.update(item.id, { status: "synced" });
        synced++;
      } else {
        const errorText = await response.text();
        await fieldDb.outbox.update(item.id, {
          status: "pending",
          attempts: item.attempts + 1,
          lastError: errorText,
        });
        failed++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      await fieldDb.outbox.update(item.id, {
        status: "pending",
        attempts: item.attempts + 1,
        lastError: msg,
      });
      failed++;
    }
  }

  return { synced, failed };
}

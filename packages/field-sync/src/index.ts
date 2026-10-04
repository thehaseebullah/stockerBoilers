import Dexie, { type EntityTable } from "dexie";
import { FieldCommand } from "@stoker/contracts";

export interface OutboxItem extends FieldCommand {
  attempts: number;
  lastError?: string;
  status: "pending" | "syncing" | "rejected";
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
      outbox: "id, status, capturedAt",
      media: "id, commandId, deliveryId, status, capturedAt",
    });
  }
}

export const fieldDb = new FieldDatabase();

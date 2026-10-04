"use client";

import { useState, useEffect } from "react";
import { Button } from "@stoker/ui";
import { fieldDb, drainOutbox, isOnline, OutboxItem } from "@stoker/field-sync";
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";

export default function FieldSyncPage() {
  const [online, setOnline] = useState(true);
  const [items, setItems] = useState<OutboxItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadOutbox = async () => {
    setOnline(isOnline());
    try {
      const allItems = await fieldDb.outbox.orderBy("createdAt").reverse().toArray();
      setItems(allItems);
    } catch {
      // IndexedDB might be unavailable during SSR
    }
  };

  useEffect(() => {
    loadOutbox();
    const handleOnline = () => {
      setOnline(true);
      drainOutbox().then(loadOutbox);
    };
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleDrain = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await drainOutbox();
      setMessage(`Synced ${res.synced} events (${res.failed} retries pending)`);
      await loadOutbox();
    } catch {
      setMessage("Sync encountered an issue");
    } finally {
      setSyncing(false);
    }
  };

  const pendingCount = items.filter((i) => i.status === "pending" || i.status === "syncing").length;

  return (
    <div className="space-y-4">
      {/* Network State Card */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {online ? (
              <div className="w-8 h-8 rounded-full bg-[var(--ok-sunk)] flex items-center justify-center text-[var(--ok)]">
                <Wifi className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--danger-sunk)] flex items-center justify-center text-[var(--danger)]">
                <WifiOff className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-[var(--ink)] font-[family-name:var(--font-display)]">
                {online ? "Connected (Online)" : "Offline Mode (Queuing)"}
              </div>
              <div className="text-xs text-[var(--ink-3)]">
                {online ? "Changes sync automatically to console" : "Actions stored in device IndexedDB"}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--surface-sunk)] text-[var(--ink-2)] border border-[var(--line)]">
            {pendingCount} Pending
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--line)] flex gap-2">
          <Button
            variant="primary"
            className="flex-1 h-10 text-xs font-semibold"
            disabled={syncing || !online}
            onClick={handleDrain}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing Outbox..." : "Sync Now"}
          </Button>

          <Button
            variant="secondary"
            className="h-10 text-xs"
            onClick={loadOutbox}
          >
            Refresh
          </Button>
        </div>

        {message && (
          <div className="mt-3 p-2.5 bg-[var(--surface-sunk)] border border-[var(--line)] text-xs text-[var(--ink-2)] rounded-[var(--radius-control)]">
            {message}
          </div>
        )}
      </div>

      {/* Outbox Items List */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-3">
        <h2 className="text-sm font-semibold text-[var(--ink)] flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[var(--ink-3)]" />
          <span>Local IndexedDB Queue ({items.length} total)</span>
        </h2>

        {items.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--ink-3)]">
            Outbox queue is empty. All device actions are up to date!
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)] text-xs">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="font-semibold text-[var(--ink)] truncate">{item.name}</div>
                  <div className="text-[10px] text-[var(--ink-3)] font-mono truncate">
                    UUID: {item.id.slice(0, 18)}...
                  </div>
                  <div className="text-[10px] text-[var(--ink-2)]">
                    {new Date(item.capturedAt).toLocaleTimeString()} • {item.attempts} attempts
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "synced"
                        ? "bg-[var(--ok-sunk)] text-[var(--ok)]"
                        : item.status === "syncing"
                        ? "bg-[var(--warning-sunk)] text-[var(--warning)]"
                        : "bg-[var(--surface-sunk)] text-[var(--ink-2)]"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

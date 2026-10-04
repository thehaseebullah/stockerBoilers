import * as React from "react";
import { cn } from "./utils";

export type PillVariant = "ok" | "warn" | "danger" | "fuel" | "info" | "neutral";

export interface StatusPillProps {
  label?: string;
  status?: string;
  variant?: PillVariant;
  className?: string;
  dot?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  status,
  variant,
  className,
  dot = true,
}) => {
  const displayLabel = label ?? status ?? "neutral";
  
  // Auto-resolve variant if not explicitly provided
  let resolvedVariant = variant;
  if (!resolvedVariant && (status || label)) {
    const s = (status ?? label ?? "").toLowerCase();
    if (["active", "approved", "arrived", "installed", "ok"].includes(s)) {
      resolvedVariant = "ok";
    } else if (["disputed", "rejected", "closed", "danger"].includes(s)) {
      resolvedVariant = "danger";
    } else if (["dispatched", "in_transit", "pending", "submitted", "warn", "warning", "settling"].includes(s)) {
      resolvedVariant = "warn";
    } else if (["fuel"].includes(s)) {
      resolvedVariant = "fuel";
    } else {
      resolvedVariant = "neutral";
    }
  }
  if (!resolvedVariant) resolvedVariant = "neutral";
  const variantStyles: Record<PillVariant, { pill: string; dot: string }> = {
    ok: {
      pill: "bg-[var(--ok-soft)] text-[var(--ok)] border-[var(--ok)]/30 shadow-[0_0_12px_-3px_rgba(52,211,153,0.3)]",
      dot: "bg-[var(--ok)] shadow-[0_0_6px_rgba(52,211,153,0.8)]",
    },
    warn: {
      pill: "bg-[var(--warn-soft)] text-[var(--warn)] border-[var(--warn)]/30 shadow-[0_0_12px_-3px_rgba(251,191,36,0.3)]",
      dot: "bg-[var(--warn)] shadow-[0_0_6px_rgba(251,191,36,0.8)]",
    },
    danger: {
      pill: "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/30 shadow-[0_0_12px_-3px_rgba(251,113,133,0.3)]",
      dot: "bg-[var(--danger)] shadow-[0_0_6px_rgba(251,113,133,0.8)]",
    },
    fuel: {
      pill: "bg-[var(--fuel-soft)] text-[var(--fuel)] border-[var(--fuel)]/30 shadow-[0_0_12px_-3px_rgba(251,146,60,0.3)]",
      dot: "bg-[var(--fuel)] shadow-[0_0_6px_rgba(251,146,60,0.8)]",
    },
    info: {
      pill: "bg-[var(--info-soft)] text-[var(--info)] border-[var(--info)]/30 shadow-[0_0_12px_-3px_rgba(129,140,248,0.3)]",
      dot: "bg-[var(--info)] shadow-[0_0_6px_rgba(129,140,248,0.8)]",
    },
    neutral: {
      pill: "bg-[var(--surface-sunk)] text-[var(--ink-2)] border-[var(--line)]",
      dot: "bg-[var(--ink-3)]",
    },
  };

  const style = variantStyles[resolvedVariant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border select-none transition-all duration-150 hover:brightness-110",
        style.pill,
        className
      )}
    >
      {dot ? (
        <span className="relative flex h-2 w-2">
          {resolvedVariant === "ok" || resolvedVariant === "danger" ? (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                style.dot
              )}
            />
          ) : null}
          <span className={cn("relative inline-flex rounded-full h-2 w-2", style.dot)} />
        </span>
      ) : null}
      <span>{displayLabel.replace(/_/g, " ")}</span>
    </span>
  );
};

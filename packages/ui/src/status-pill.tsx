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
      pill: "bg-[var(--ok-soft)] text-[var(--ok)] border-[var(--ok)]/20",
      dot: "bg-[var(--ok)]",
    },
    warn: {
      pill: "bg-[var(--warn-soft)] text-[var(--warn)] border-[var(--warn)]/20",
      dot: "bg-[var(--warn)]",
    },
    danger: {
      pill: "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/20",
      dot: "bg-[var(--danger)]",
    },
    fuel: {
      pill: "bg-[var(--fuel-soft)] text-[var(--fuel)] border-[var(--fuel)]/20",
      dot: "bg-[var(--fuel)]",
    },
    info: {
      pill: "bg-[var(--info-soft)] text-[var(--info)] border-[var(--info)]/20",
      dot: "bg-[var(--info)]",
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
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize select-none",
        style.pill,
        className
      )}
    >
      {dot ? <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} /> : null}
      <span>{displayLabel.replace(/_/g, " ")}</span>
    </span>
  );
};

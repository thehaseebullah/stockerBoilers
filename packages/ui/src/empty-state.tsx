import * as React from "react";
import { cn } from "./utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-[var(--radius-panel)] border border-dashed border-[var(--line)] bg-[var(--surface)]",
        className
      )}
    >
      {icon ? <div className="mb-3 text-[var(--ink-3)]">{icon}</div> : null}
      <h3 className="text-base font-semibold font-[family-name:var(--font-display)] text-[var(--ink)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--ink-2)] mt-1 max-w-sm">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

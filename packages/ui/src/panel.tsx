import * as React from "react";
import { cn } from "./utils";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  description,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-panel)] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden",
        className
      )}
      {...props}
    >
      {title || action ? (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
          <div>
            {title ? (
              <h2 className="text-base font-semibold tracking-tight font-[family-name:var(--font-display)] text-[var(--ink)]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-xs text-[var(--ink-2)] mt-0.5">{description}</p>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      <div className="p-6">{children}</div>
    </div>
  );
};

import * as React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="w-full space-y-1">
        {label ? (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--ink)]">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full h-10 px-3 bg-[var(--surface)] border border-[var(--line-strong)] rounded-[var(--radius-control)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] disabled:opacity-50 disabled:bg-[var(--surface-sunk)]",
            error ? "border-[var(--danger)] focus:ring-[var(--danger)]" : "",
            className
          )}
          {...props}
        />
        {error ? <p className="text-xs text-[var(--danger)] mt-1">{error}</p> : null}
      </div>
    );
  }
);
Input.displayName = "Input";

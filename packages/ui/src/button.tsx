import * as React from "react";
import { cn } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-[var(--radius-control)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles = {
      primary: "bg-gradient-to-r from-[var(--primary)] to-sky-500 text-white shadow-[0_0_15px_-3px_rgba(56,189,248,0.4)] hover:brightness-110 border border-sky-400/30",
      secondary: "bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/30 hover:bg-[var(--primary)] hover:text-white",
      outline: "border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-sunk)] hover:border-[var(--primary)]/50",
      danger: "bg-gradient-to-r from-[var(--danger)] to-rose-600 text-white shadow-[0_0_15px_-3px_rgba(251,113,133,0.4)] hover:brightness-110 border border-rose-400/30",
      ghost: "text-[var(--ink)] hover:bg-[var(--surface-sunk)] hover:text-[var(--primary)]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

import * as React from "react";
import { cn } from "./utils";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink)]/40 backdrop-blur-xs">
      <div
        className={cn(
          "w-full max-w-lg bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-panel)] shadow-xl overflow-hidden animate-in fade-in duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
          <div>
            <h2 className="text-lg font-semibold font-[family-name:var(--font-display)] text-[var(--ink)]">
              {title}
            </h2>
            {description ? (
              <p className="text-xs text-[var(--ink-2)] mt-0.5">{description}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius-control)] hover:bg-[var(--surface-sunk)] text-[var(--ink-3)] hover:text-[var(--ink)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

import * as React from "react";
import { cn } from "./utils";
import { Check } from "lucide-react";

export interface LifecycleStepperProps {
  steps: readonly string[];
  currentStep: string;
  className?: string;
}

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  steps,
  currentStep,
  className,
}) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className={cn("flex items-center w-full overflow-x-auto py-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = currentIndex > index;
        const isCurrent = currentIndex === index;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors",
                  isCompleted
                    ? "bg-[var(--ok)] text-white border-[var(--ok)]"
                    : isCurrent
                    ? "bg-[var(--primary)] text-[var(--ink-inverse)] border-[var(--primary)] ring-2 ring-[var(--focus)] ring-offset-2"
                    : "bg-[var(--surface-sunk)] text-[var(--ink-3)] border-[var(--line)]"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium capitalize",
                  isCurrent ? "text-[var(--ink)] font-semibold" : "text-[var(--ink-2)]"
                )}
              >
                {step.replace(/_/g, " ")}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                className={cn(
                  "flex-1 min-w-8 h-[2px] mx-2",
                  isCompleted ? "bg-[var(--ok)]" : "bg-[var(--line)]"
                )}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

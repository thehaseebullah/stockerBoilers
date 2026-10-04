import * as React from "react";
import { cn } from "./utils";

export interface MoneyInputProps {
  valueMinor?: bigint;
  currency?: string;
  onChangeMinor?: (valueMinor: bigint) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  valueMinor = 0n,
  currency = "USD",
  onChangeMinor,
  label,
  error,
  disabled,
  className,
  placeholder = "0.00",
}) => {
  const [displayValue, setDisplayValue] = React.useState<string>(
    valueMinor ? (Number(valueMinor) / 100).toFixed(2) : ""
  );

  React.useEffect(() => {
    if (valueMinor !== undefined) {
      setDisplayValue((Number(valueMinor) / 100).toFixed(2));
    }
  }, [valueMinor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setDisplayValue(raw);

    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && onChangeMinor) {
      const minor = BigInt(Math.round(parsed * 100));
      onChangeMinor(minor);
    } else if (raw === "" && onChangeMinor) {
      onChangeMinor(0n);
    }
  };

  return (
    <div className="w-full space-y-1">
      {label ? (
        <label className="block text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wider">
          {currency}
        </span>
        <input
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          onChange={handleChange}
          className={cn(
            "w-full h-10 pl-14 pr-3 text-right bg-[var(--surface)] border border-[var(--line-strong)] rounded-[var(--radius-control)] text-sm text-[var(--ink)] font-[family-name:var(--font-display)] tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--focus)] disabled:opacity-50",
            error ? "border-[var(--danger)] focus:ring-[var(--danger)]" : "",
            className
          )}
        />
      </div>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
};

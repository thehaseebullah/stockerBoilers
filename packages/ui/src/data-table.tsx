import * as React from "react";
import { cn } from "./utils";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto border border-[var(--line)] rounded-[var(--radius-card)] bg-[var(--surface)]", className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--line)] bg-[var(--surface-sunk)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 font-semibold text-xs text-[var(--ink-2)] tracking-wider uppercase",
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[var(--ink-3)]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-[var(--primary-soft)]/20 transition-colors h-11">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-sm text-[var(--ink)]",
                      col.align === "right" ? "text-right font-[family-name:var(--font-display)] tabular-nums" : col.align === "center" ? "text-center" : "text-left"
                    )}
                  >
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

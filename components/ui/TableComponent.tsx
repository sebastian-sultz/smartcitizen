import * as React from "react";
import { cn } from "@/lib/utils";

export interface Header<T> {
  label: string;
  width?: string;
  render: (row: T) => React.ReactNode;
}

export interface TableComponentProps<T> {
  headers: Header<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function TableComponent<T>({ headers, data, loading, emptyMessage, className }: TableComponentProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-border bg-white shadow-card", className)}>
      <table className="w-full border-collapse text-left">
        <thead className="bg-bg border-b border-border text-[12px] font-bold uppercase tracking-wider text-text-light">
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ width: h.width }} className="p-6">
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm text-text">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="p-8 text-center text-text-muted font-medium">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="p-8 text-center text-text-muted font-medium">
                {emptyMessage || "No data available"}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-bg/50 transition-colors">
                {headers.map((h, colIndex) => (
                  <td key={colIndex} className="p-6">
                    {h.render(row)}
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

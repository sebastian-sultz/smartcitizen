import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableHeader as ShadcnTableHeader, TableBody as ShadcnTableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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
    <Table className={className}>
      <ShadcnTableHeader>
        <TableRow>
          {headers.map((h, i) => (
            <TableHead key={i} style={{ width: h.width }} className="p-6">
              {h.label}
            </TableHead>
          ))}
        </TableRow>
      </ShadcnTableHeader>
      <ShadcnTableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={headers.length} className="p-12 text-center">
              <Spinner className="mx-auto size-8 text-primary" />
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={headers.length} className="p-8 text-center text-text-muted font-medium">
              {emptyMessage || "No data available"}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-bg/50 transition-colors">
              {headers.map((h, colIndex) => (
                <TableCell key={colIndex} className="p-6">
                  {h.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </ShadcnTableBody>
    </Table>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Table, TableHeader as ShadcnTableHeader, TableBody as ShadcnTableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Inbox } from "lucide-react";

export interface Header<T> {
  label: string;
  width?: string;
  render: (row: T) => React.ReactNode;
}

export interface TablePaginationProps {
  page?: number;
  limit?: number;
  total: number;
  onChange: (page: number, limit: number) => void;
  pageSizeOptions?: number[];
}

export interface TableComponentProps<T> {
  headers: Header<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  pagination?: TablePaginationProps;
}

export function TableComponent<T>({
  headers,
  data,
  loading,
  emptyMessage,
  className,
  pagination,
}: TableComponentProps<T>) {
  // Local state for internal pagination management if page/limit are not controlled by the parent
  const [internalPage, setInternalPage] = React.useState(1);
  const [internalLimit, setInternalLimit] = React.useState(10);

  const currentPage = pagination?.page !== undefined ? pagination.page : internalPage;
  const pageSize = pagination?.limit !== undefined ? pagination.limit : internalLimit;
  const totalRecords = pagination?.total ?? 0;

  // Reset page when total records changes to ensure proper alignment
  React.useEffect(() => {
    if (pagination?.page === undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRecords]);

  const handlePageChange = (newPage: number) => {
    if (pagination?.page === undefined) {
      setInternalPage(newPage);
    }
    pagination?.onChange(newPage, pageSize);
  };

  const handleLimitChange = (newLimit: number) => {
    if (pagination?.limit === undefined) {
      setInternalLimit(newLimit);
      setInternalPage(1);
    }
    pagination?.onChange(1, newLimit);
  };

  // Pages list generator for pagination UI
  const getPagesList = (totalPages: number, curPage: number) => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (curPage <= 3) {
      pages.push(1, 2, 3, 4, "ellipsis", totalPages);
    } else if (curPage >= totalPages - 2) {
      pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "ellipsis", curPage - 1, curPage, curPage + 1, "ellipsis", totalPages);
    }
    return pages;
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { pageSizeOptions = [10, 20, 50, 100] } = pagination;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startRange = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalRecords);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-4 px-6 py-4 border border-border/70 md:border-none md:border-t md:border-border/80 bg-white rounded-card md:rounded-none  shadow-sm md:shadow-none mt-4 md:mt-0">
        {/* Total records display */}
        <div className="text-xs text-text-muted font-medium text-center md:text-left">
          Showing <span className="font-semibold text-text">{startRange}</span>{" "}
          to <span className="font-semibold text-text">{endRange}</span> of{" "}
          <span className="font-semibold text-text">{totalRecords}</span>{" "}
          entries
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center w-full">
          {totalPages > 1 && (
            <Pagination className="w-auto mx-0">
              <PaginationContent className="flex items-center gap-1 justify-center">
                {/* First Page */}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="size-8 p-0 rounded-lg hover:bg-bg text-text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    title="First Page"
                  >
                    <ChevronsLeft size={16} />
                  </Button>
                </PaginationItem>

                {/* Previous Page */}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="size-8 p-0 rounded-lg hover:bg-bg text-text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                </PaginationItem>

                {/* Page List */}
                <div className="hidden sm:flex items-center gap-1">
                  {getPagesList(totalPages, currentPage).map((p, idx) => {
                    if (p === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis className="size-8 text-text-muted flex items-center justify-center" />
                        </PaginationItem>
                      );
                    }
                    return (
                      <PaginationItem key={p}>
                        <Button
                          variant={currentPage === p ? "outline" : "ghost"}
                          size="icon"
                          onClick={() => handlePageChange(p as number)}
                          className={cn(
                            "size-8 p-0 rounded-lg font-bold text-xs transition-colors",
                            currentPage === p
                              ? "border-2 border-primary text-primary hover:bg-primary/5"
                              : "text-text-muted hover:text-primary hover:bg-bg",
                          )}
                        >
                          {p}
                        </Button>
                      </PaginationItem>
                    );
                  })}
                </div>

                {/* Next Page */}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="size-8 p-0 rounded-lg hover:bg-bg text-text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </PaginationItem>

                {/* Last Page */}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="size-8 p-0 rounded-lg hover:bg-bg text-text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    title="Last Page"
                  >
                    <ChevronsRight size={16} />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Rows per page selector */}
        <div className="hidden md:flex items-center gap-2 justify-end w-full">
          <span className="text-xs text-text-muted font-medium">
            Rows per page:
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(val) => handleLimitChange(Number(val))}
          >
            <SelectTrigger className="w-[75px] px-3 py-1.5 text-xs rounded-xl h-9 border-border bg-bg/50 font-semibold focus:border-primary">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent position="popper" className="min-w-[75px]">
              {pageSizeOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt.toString()}
                  className="text-xs font-semibold"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col md:overflow-hidden md:rounded-2xl md:border md:border-border md:bg-white md:shadow-card">
      {/* Desktop View (Table Layout) */}
      <div className="w-full overflow-x-auto hidden md:block">
        <Table className={className} noWrapper>
          <ShadcnTableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-bg/50">
              {headers.map((h, i) => (
                <TableHead
                  key={i}
                  style={{ width: h.width }}
                  className={cn(
                    "px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-light",
                    i === 0 ? "text-left" : "text-center"
                  )}
                >
                  {h.label}
                </TableHead>
              ))}
            </TableRow>
          </ShadcnTableHeader>
          <ShadcnTableBody>
            {loading ? (
              // Animated skeleton loader rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <TableRow key={rIdx} className="hover:bg-transparent">
                  {headers.map((_, cIdx) => (
                    <TableCell 
                      key={cIdx} 
                      className={cn(
                        "px-6 py-4",
                        cIdx === 0 ? "text-left" : "text-center"
                      )}
                    >
                      <Skeleton
                        className={cn(
                          "h-5 rounded-md animate-pulse bg-border/60",
                          cIdx === 0
                            ? "w-1/2"
                            : cIdx === headers.length - 1
                            ? "w-2/3 mx-auto"
                            : "w-3/4 mx-auto"
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // EmptyState component
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={headers.length} className="p-8">
                  <div className="max-w-md mx-auto py-4">
                    <EmptyState
                      icon={Inbox}
                      title="No Records Available"
                      description={emptyMessage || "There are no entries to display in this list at the moment."}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows with hover transitions
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-bg/40 transition-colors border-b border-border/50 [&:last-child]:border-0">
                  {headers.map((h, colIndex) => (
                    <TableCell 
                      key={colIndex} 
                      className={cn(
                        "px-6 py-4.5 align-middle text-sm text-text font-medium",
                        colIndex === 0 ? "text-left" : "text-center"
                      )}
                    >
                      {h.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </ShadcnTableBody>
        </Table>
      </div>

      {/* Mobile View (Card List Fallback Layout) */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, rIdx) => (
              <div key={rIdx} className="bg-white rounded-[24px] border border-border/70 p-5 space-y-4 animate-pulse">
                {headers.slice(0, Math.min(headers.length, 4)).map((h, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center">
                    <Skeleton className="h-3.5 w-16 bg-border/60" />
                    <Skeleton className="h-5 w-24 bg-border/60" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 bg-white rounded-[24px] border border-border/70">
            <div className="max-w-md mx-auto py-4">
              <EmptyState
                icon={Inbox}
                title="No Records Available"
                description={emptyMessage || "There are no entries to display in this list at the moment."}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((row, rowIndex) => {
              const primaryHeader = headers[0];
              const actionHeader = headers.find((h) => h.label === "Actions");
              const statusHeader = headers.find((h) => h.label === "Status");
              const metadataHeaders = headers.filter(
                (h, idx) => idx > 0 && h.label !== "Actions" && h.label !== "Status"
              );

              return (
                <div
                  key={rowIndex}
                  className="bg-white rounded-card border border-border/70 shadow-sm hover:shadow-md transition-all p-5 space-y-4"
                >
                  {/* Card Top Row: Primary Identity and Status */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {primaryHeader.render(row)}
                    </div>
                    {statusHeader && (
                      <div className="shrink-0">
                        {statusHeader.render(row)}
                      </div>
                    )}
                  </div>

                  {/* Card Metadata Stack */}
                  {metadataHeaders.length > 0 && (
                    <div className="space-y-3 pt-3.5 border-t border-border/30">
                      {metadataHeaders.map((h, colIdx) => (
                        <div key={colIdx} className="flex justify-between items-start gap-4 text-xs py-0.5 min-w-0">
                          <span className="font-semibold text-text-muted uppercase tracking-wider text-[10px] shrink-0 pt-0.5">
                            {h.label}
                          </span>
                          <div className="text-text font-bold break-all text-right min-w-0">
                            {h.render(row)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card Actions Footer */}
                  {actionHeader && (
                    <div className="pt-3.5 border-t border-border/50 flex justify-end">
                      <div className="flex flex-wrap gap-2.5 w-full justify-center [&>div]:contents">
                        {actionHeader.render(row)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {renderPagination()}
    </div>
  );
}

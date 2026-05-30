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
      setInternalPage(1);
    }
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/80 bg-white select-none">
        {/* Total records display */}
        <div className="text-xs text-text-muted font-medium">
          Showing <span className="font-semibold text-text">{startRange}</span> to{" "}
          <span className="font-semibold text-text">{endRange}</span> of{" "}
          <span className="font-semibold text-text">{totalRecords}</span> entries
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-medium">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => handleLimitChange(Number(val))}
            >
              <SelectTrigger className="w-[75px] px-3 py-1.5 text-xs rounded-xl h-9 border-border bg-bg/50 font-semibold focus:border-primary">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent position="popper" className="min-w-[75px]">
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt.toString()} className="text-xs font-semibold">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="w-auto mx-0">
              <PaginationContent className="flex items-center gap-1">
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
                            : "text-text-muted hover:text-primary hover:bg-bg"
                        )}
                      >
                        {p}
                      </Button>
                    </PaginationItem>
                  );
                })}

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
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="w-full overflow-x-auto">
        <Table className={className}>
          <ShadcnTableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-bg/50">
              {headers.map((h, i) => (
                <TableHead
                  key={i}
                  style={{ width: h.width }}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-light"
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
                    <TableCell key={cIdx} className="px-6 py-4">
                      <Skeleton
                        className={cn(
                          "h-5 rounded-md animate-pulse bg-border/60",
                          cIdx === 0
                            ? "w-1/2"
                            : cIdx === headers.length - 1
                            ? "w-2/3 ml-auto"
                            : "w-3/4"
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
                    <TableCell key={colIndex} className="px-6 py-4.5 align-middle text-sm text-text font-medium">
                      {h.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </ShadcnTableBody>
        </Table>
      </div>
      {renderPagination()}
    </div>
  );
}

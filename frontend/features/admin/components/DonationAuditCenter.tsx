"use client";

import React, { useState, useEffect } from "react";
import {
  getAdminPaymentHistory,
  downloadPaymentsCSV,
  downloadPaymentsPDF,
  downloadForm10BDCSV,
  PaymentFilterParams,
} from "../api";
import { getReceiptStatus } from "@/features/citizen/api";
import { PaymentAdminResponse } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { downloadBlob } from "@/lib/utils";
import {
  FileSpreadsheet,
  FileText,
  Calendar,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { getDonationColumns } from "./DonationColumns";
import { DonationDetailsDialog } from "./DonationDetailsDialog";
import { DonationFiltersDialog } from "./DonationFiltersDialog";
import { ExportFYDialog } from "./ExportFYDialog";

export const DonationAuditCenter = () => {
  const fyOptions = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const isNewFY = now.getMonth() >= 3; // April or later
    const startYear = isNewFY ? currentYear : currentYear - 1;
    
    const options = [];
    for (let i = 0; i < 5; i++) {
      const yr = startYear - i;
      options.push(`${yr}-${yr + 1}`);
    }
    return options;
  }, []);

  const [payments, setPayments] = useState<PaymentAdminResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Filters state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState<PaymentFilterParams>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Modal States
  const [selectedPayment, setSelectedPayment] = useState<PaymentAdminResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // 10BD Modal State
  const [fyOpen, setFyOpen] = useState(false);
  const [selectedFY, setSelectedFY] = useState(fyOptions[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  const [prevStatus, setPrevStatus] = useState(status);
  const [prevSort, setPrevSort] = useState(sort);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [prevPage, setPrevPage] = useState(page);
  const [prevLimit, setPrevLimit] = useState(limit);

  if (
    debouncedSearch !== prevSearch ||
    status !== prevStatus ||
    sort !== prevSort ||
    JSON.stringify(filters) !== JSON.stringify(prevFilters)
  ) {
    setPrevSearch(debouncedSearch);
    setPrevStatus(status);
    setPrevSort(sort);
    setPrevFilters(filters);
    setPage(1);
    setIsLoading(true);
  } else if (page !== prevPage || limit !== prevLimit) {
    setPrevPage(page);
    setPrevLimit(limit);
    setIsLoading(true);
  }

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      
      const filterParams: PaymentFilterParams = {
        page,
        limit,
        ...filters,
      };

      if (debouncedSearch) filterParams.search = debouncedSearch;
      if (status !== "ALL") filterParams.status = status;
      if (sort === "oldest") {
        filterParams.sortBy = "created_at";
        filterParams.sortOrder = "asc";
      } else {
        filterParams.sortBy = "created_at";
        filterParams.sortOrder = "desc";
      }

      const res = await getAdminPaymentHistory(filterParams);
      if (res) {
        setPayments(res.data || []);
        if (res.pagination) {
          setTotalRows(res.pagination.total_rows);
        }
      }
    } catch (err) {
      console.error("Failed to load payment history:", err);
      toast.error("Failed to load payment history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, limit, debouncedSearch, status, sort, filters]);

  const handleExportCSV = async () => {
    try {
      setIsExportingCSV(true);
      const filterParams: PaymentFilterParams = {
        ...filters,
      };
      if (debouncedSearch) filterParams.search = debouncedSearch;
      if (status !== "ALL") filterParams.status = status;

      toast.info("Preparing payments CSV export...");
      await downloadPaymentsCSV(filterParams);
      toast.success("CSV export downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV");
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      const filterParams: PaymentFilterParams = {
        ...filters,
      };
      if (debouncedSearch) filterParams.search = debouncedSearch;
      if (status !== "ALL") filterParams.status = status;

      toast.info("Generating donations financial audit PDF report...");
      await downloadPaymentsPDF(filterParams);
      toast.success("Donations audit PDF downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export donations PDF report");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExport10BD = async () => {
    try {
      toast.info(`Preparing Form 10BD export for financial year ${selectedFY}...`);
      await downloadForm10BDCSV(selectedFY);
      toast.success("Form 10BD CSV downloaded successfully");
      setFyOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Form 10BD compliance file");
    }
  };

  const handleViewDetails = (payment: PaymentAdminResponse) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };

  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      toast.info("Retrieving receipt download link...");
      const res = await getReceiptStatus(transactionId);
      if (res && res.url) {
        downloadBlob(res.url, `80G_Receipt_${transactionId}.pdf`);
      } else {
        toast.error("Receipt file is currently unavailable.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to download receipt PDF.");
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.taxExemption !== undefined) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.status && filters.status !== "ALL" && status === "ALL") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const columns = getDonationColumns({
    onViewDetails: handleViewDetails,
    onDownloadReceipt: handleDownloadReceipt,
  });

  return (
    <Card shape="mobile-flush" className="w-full bg-transparent sm:bg-surface">
      <CardHeader className="flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Donation & Transaction Ledger</CardTitle>
            <p className="text-xs text-text-muted mt-1">
              {totalRows} transaction record{totalRows === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap sm:flex-nowrap">
            <Button
              className="whitespace-nowrap"
              variant="secondary"
              onClick={handleExportCSV}
              startIcon={
                <FileSpreadsheet
                  size={15}
                  className="text-emerald-600 shrink-0"
                />
              }
              size="sm"
              loading={isExportingCSV}
              title="Export all filtered payment records as CSV"
            >
              Export CSV
            </Button>
            <Button
              className="whitespace-nowrap"
              variant="secondary"
              onClick={handleExportPDF}
              startIcon={
                <FileText size={15} className="text-primary shrink-0" />
              }
              size="sm"
              loading={isExportingPDF}
              title="Export official financial audit PDF ledger"
            >
              Export PDF
            </Button>
            <Button
              className="whitespace-nowrap"
              variant="primary"
              onClick={() => setFyOpen(true)}
              startIcon={<Calendar size={15} className="shrink-0" />}
              size="sm"
              title="Export 80G Statutory Form 10BD for Income Tax compliance"
            >
              Form 10BD
            </Button>
          </div>
        </div>

        {/* Quick Status Filter Pills (Mobile Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { label: "All Donations", value: "ALL" },
            { label: "Successful", value: "SUCCESS" },
            { label: "Pending", value: "PENDING" },
            { label: "Failed", value: "FAILED" },
            { label: "Cancelled", value: "CANCELLED" },
          ].map((item) => (
            <Badge
              key={item.value}
              variant={status === item.value ? "default" : "outline"}
              className="cursor-pointer select-none"
              role="button"
              tabIndex={0}
              onClick={() => {
                setStatus(item.value);
                setPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setStatus(item.value);
                  setPage(1);
                }
              }}
            >
              {item.label}
            </Badge>
          ))}
        </div>

        {/* Filter, Search & Sort Toolbar (Mobile-First) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
          <div className="flex items-center gap-2 w-full sm:w-80">
            <div className="flex-1">
              <Input
                placeholder="Search donor name, order ID, UTR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={16} />}
                size="sm"
                // shape="pill"
              />
            </div>
            <Button
              variant={activeFiltersCount > 0 ? "default" : "secondary"}
              size="sm"
              className="shrink-0 relative"
              onClick={() => setIsFilterDialogOpen(true)}
              startIcon={<SlidersHorizontal size={15} />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-44">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TableComponent
          headers={columns}
          data={payments}
          loading={isLoading}
          emptyMessage="No matching donation records found"
          className="shadow-none border-0"
          pagination={{
            page,
            limit,
            total: totalRows,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
          }}
        />
      </CardContent>

      {/* Advanced Filters Modal */}
      <DonationFiltersDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={{
          ...filters,
          status: status !== "ALL" ? status : filters.status,
        }}
        onApply={(updated) => {
          if (updated.status && updated.status !== status) {
            setStatus(updated.status);
          }
          setFilters(updated);
        }}
        onReset={() => {
          setFilters({});
          setStatus("ALL");
        }}
      />

      <DonationDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        payment={selectedPayment}
        onDownloadReceipt={handleDownloadReceipt}
      />

      <ExportFYDialog
        open={fyOpen}
        onOpenChange={setFyOpen}
        selectedFY={selectedFY}
        onSelectedFYChange={setSelectedFY}
        fyOptions={fyOptions}
        onExport={handleExport10BD}
      />
    </Card>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { 
  getAdminPaymentHistory, 
  downloadPaymentsCSV, 
  downloadPaymentsPDF,
  downloadForm10BDCSV
} from "../api";
import { getReceiptStatus } from "@/features/citizen/api";
import { PaymentAdminResponse } from "../types";
import { Card, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { downloadBlob } from "@/lib/utils";
import { FileSpreadsheet, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getDonationColumns } from "./DonationColumns";
import { DonationDetailsDialog } from "./DonationDetailsDialog";
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
  const [status, setStatus] = useState("ALL");
  const [taxExemption, setTaxExemption] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modal States
  const [selectedPayment, setSelectedPayment] = useState<PaymentAdminResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // 10BD Modal State
  const [fyOpen, setFyOpen] = useState(false);
  const [selectedFY, setSelectedFY] = useState(fyOptions[0]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      
      const filterParams: Record<string, any> = {
        page,
        limit,
      };

      if (search) filterParams.search = search;
      if (status !== "ALL") filterParams.status = status;
      if (taxExemption !== "ALL") filterParams.taxExemption = taxExemption === "yes";
      if (startDate) filterParams.startDate = startDate;
      if (endDate) filterParams.endDate = endDate;

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
  }, [page, limit, status, taxExemption, startDate, endDate]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchPayments();
    }
  };

  const triggerSearch = () => {
    setPage(1);
    fetchPayments();
  };

  const handleExportCSV = async () => {
    try {
      setIsExportingCSV(true);
      const filterParams: Record<string, any> = {};
      if (search) filterParams.search = search;
      if (status !== "ALL") filterParams.status = status;
      if (taxExemption !== "ALL") filterParams.taxExemption = taxExemption === "yes";
      if (startDate) filterParams.startDate = startDate;
      if (endDate) filterParams.endDate = endDate;

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
      const filterParams: Record<string, any> = {};
      if (search) filterParams.search = search;
      if (status !== "ALL") filterParams.status = status;
      if (taxExemption !== "ALL") filterParams.taxExemption = taxExemption === "yes";
      if (startDate) filterParams.startDate = startDate;
      if (endDate) filterParams.endDate = endDate;

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

  const columns = getDonationColumns({
    onViewDetails: handleViewDetails,
    onDownloadReceipt: handleDownloadReceipt,
  });

  return (
    <div className="space-y-6">
      {/* Mobile Filters Toggle Button */}
      <div className="flex md:hidden justify-between items-center gap-4 bg-white p-4 rounded-card border border-border/70 shadow-sm">
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-text truncate">Filters & Search</span>
          <span className="text-[11px] text-text-muted truncate">
            {status !== "ALL" || taxExemption !== "ALL" || startDate || endDate || search
              ? "Active filters applied"
              : "Tap to filter payments"}
          </span>
        </div>
        <Button
          variant={showMobileFilters ? "primary" : "secondary"}
          size="sm"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="shrink-0"
        >
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Search and Filter Panel */}
      <Card className={`md:block border-0 sm:border rounded-none sm:rounded-24px shadow-none sm:shadow-card bg-transparent sm:bg-white ${!showMobileFilters ? "hidden" : ""}`}>
        <CardContent className="p-0 pt-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            {/* Search Input */}
            <div className="lg:col-span-2 space-y-1">
              <span className="text-xs font-semibold text-text-muted">Search UTR / Order / Donor</span>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter order or donor name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  className="bg-bg/40"
                  size="sm"
                />
                <Button variant="primary" onClick={triggerSearch} size="sm">Go</Button>
              </div>
            </div>

            {/* Status Select */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-text-muted">Payment Status</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-bg/40" size="sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tax Exemption Select */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-text-muted">Tax PAN Status</span>
              <Select value={taxExemption} onValueChange={setTaxExemption}>
                <SelectTrigger className="bg-bg/40" size="sm">
                  <SelectValue placeholder="All PANs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Payments</SelectItem>
                  <SelectItem value="yes">PAN Provided</SelectItem>
                  <SelectItem value="no">No PAN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-text-muted">Start Date (YYYY-MM-DD)</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-bg/40"
                size="sm"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-text-muted">End Date (YYYY-MM-DD)</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-bg/40"
                size="sm"
              />
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-end gap-3 mt-6 border-t border-border/40 pt-4">
            <Button 
              className="col-span-1"
              variant="secondary" 
              onClick={handleExportCSV}
              startIcon={<FileSpreadsheet size={16} className="text-emerald-600 shrink-0" />}
              size="sm"
              loading={isExportingCSV}
              title="Export all filtered payment records as CSV (Includes all hidden transaction & gateway fields)"
            >
              Export CSV
            </Button>
            <Button 
              className="col-span-1"
              variant="secondary" 
              onClick={handleExportPDF}
              startIcon={<FileText size={16} className="text-primary shrink-0" />}
              size="sm"
              loading={isExportingPDF}
              title="Export official financial audit PDF ledger"
            >
              Export PDF
            </Button>
            <Button 
              className="col-span-2"
              variant="primary" 
              onClick={() => setFyOpen(true)}
              startIcon={<Calendar size={16} className="shrink-0" />}
              size="sm"
              title="Export 80G Statutory Form 10BD for Income Tax compliance"
            >
              Export Form 10BD
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Audit List */}
      <TableComponent
        headers={columns}
        data={payments}
        loading={isLoading}
        emptyMessage="No matching donation records found"
        pagination={{
          page,
          limit,
          total: totalRows,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          }
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
    </div>
  );
};

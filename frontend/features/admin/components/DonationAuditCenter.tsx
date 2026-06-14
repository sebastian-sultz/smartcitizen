"use client";

import React, { useState, useEffect } from "react";
import { 
  getAdminPaymentHistory, 
  downloadPaymentsCSV, 
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
import { FileSpreadsheet, Calendar } from "lucide-react";
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [taxExemption, setTaxExemption] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      {/* Search and Filter Panel */}
      <Card>
        <CardContent className="pt-6">
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
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 border-t border-border/40 pt-4">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              startIcon={<FileSpreadsheet size={16} />}
              size="sm"
            >
              Export CSV
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setFyOpen(true)}
              startIcon={<Calendar size={16} />}
              size="sm"
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

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PaymentFilterParams } from "../types";

interface DonationFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PaymentFilterParams;
  onApply: (updatedFilters: PaymentFilterParams) => void;
  onReset: () => void;
}

export const DonationFiltersDialog: React.FC<DonationFiltersDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onApply,
  onReset,
}) => {
  const [status, setStatus] = useState<string>("ALL");
  const [taxExemption, setTaxExemption] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (open) {
      setStatus(filters.status || "ALL");
      setTaxExemption(
        filters.taxExemption === undefined
          ? "ALL"
          : filters.taxExemption
            ? "yes"
            : "no",
      );
      setStartDate(filters.startDate || "");
      setEndDate(filters.endDate || "");
    }
  }, [open, filters]);

  const handleApply = () => {
    const updated: PaymentFilterParams = {};

    if (status && status !== "ALL") updated.status = status;
    if (taxExemption !== "ALL") updated.taxExemption = taxExemption === "yes";
    if (startDate) updated.startDate = startDate;
    if (endDate) updated.endDate = endDate;

    onApply(updated);
    onOpenChange(false);
  };

  const handleReset = () => {
    setStatus("ALL");
    setTaxExemption("ALL");
    setStartDate("");
    setEndDate("");
    onReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Advanced Donation Filters</DialogTitle>
          <DialogDescription>
            Filter donations and transaction receipts by status, 80G
            eligibility, and payment dates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
          {/* Payment Status */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Payment Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="SUCCESS">Successful</SelectItem>
                <SelectItem value="PENDING">Pending / Processing</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 80G Tax Exemption */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              80G Tax Exemption (PAN)
            </label>
            <Select value={taxExemption} onValueChange={setTaxExemption}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="All Donations" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="ALL">All Donations</SelectItem>
                <SelectItem value="yes">With PAN (80G Eligible)</SelectItem>
                <SelectItem value="no">Without PAN (General)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Donation Date Range */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Donation Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="date"
                label="From Date"
                size="sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="To Date"
                size="sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

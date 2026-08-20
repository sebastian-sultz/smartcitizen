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
import { UserFilterParams } from "../api";

interface UserFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: UserFilterParams;
  onApply: (updatedFilters: UserFilterParams) => void;
  onReset: () => void;
}

export const UserFiltersDialog: React.FC<UserFiltersDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onApply,
  onReset,
}) => {
  // Local state for filter inputs
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [minReferrals, setMinReferrals] = useState<string>("");
  const [maxReferrals, setMaxReferrals] = useState<string>("");
  const [minPayments, setMinPayments] = useState<string>("");
  const [maxPayments, setMaxPayments] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [joinedAfter, setJoinedAfter] = useState<string>("");
  const [joinedBefore, setJoinedBefore] = useState<string>("");

  // Sync local state when dialog is opened
  useEffect(() => {
    if (open) {
      setRole(filters.role || "all");
      setStatus(
        filters.is_suspended === undefined || filters.is_suspended === ""
          ? "all"
          : filters.is_suspended === "true" || filters.is_suspended === true
            ? "suspended"
            : "active",
      );
      setMinReferrals(filters.min_referrals?.toString() || "");
      setMaxReferrals(filters.max_referrals?.toString() || "");
      setMinPayments(filters.min_payments?.toString() || "");
      setMaxPayments(filters.max_payments?.toString() || "");
      setMinAmount(filters.min_amount?.toString() || "");
      setMaxAmount(filters.max_amount?.toString() || "");
      setJoinedAfter(filters.joined_after || "");
      setJoinedBefore(filters.joined_before || "");
    }
  }, [open, filters]);

  const handleApply = () => {
    const updatedFilters: UserFilterParams = {
      ...filters,
      role: role === "all" ? undefined : role,
      is_suspended:
        status === "all"
          ? undefined
          : status === "suspended"
            ? "true"
            : "false",
      min_referrals: minReferrals ? parseInt(minReferrals, 10) : undefined,
      max_referrals: maxReferrals ? parseInt(maxReferrals, 10) : undefined,
      min_payments: minPayments ? parseInt(minPayments, 10) : undefined,
      max_payments: maxPayments ? parseInt(maxPayments, 10) : undefined,
      min_amount: minAmount ? parseFloat(minAmount) : undefined,
      max_amount: maxAmount ? parseFloat(maxAmount) : undefined,
      joined_after: joinedAfter || undefined,
      joined_before: joinedBefore || undefined,
    };

    // Clean up undefined properties to avoid sending empty params
    Object.keys(updatedFilters).forEach((key) => {
      const k = key as keyof UserFilterParams;
      if (updatedFilters[k] === undefined) {
        delete updatedFilters[k];
      }
    });

    onApply(updatedFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setRole("all");
    setStatus("all");
    setMinReferrals("");
    setMaxReferrals("");
    setMinPayments("");
    setMaxPayments("");
    setMinAmount("");
    setMaxAmount("");
    setJoinedAfter("");
    setJoinedBefore("");
    onReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Advanced User Filters</DialogTitle>
          <DialogDescription>
            Filter the registered Smart Citizens by custom ranges and
            credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
          {/* Role Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Citizen Role
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="member">Smart Citizen</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Status Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Account Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="suspended">Suspended Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Referrals Count Range */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Referrals Count
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                size="sm"
                value={minReferrals}
                onChange={(e) => setMinReferrals(e.target.value)}
              />
              <span className="text-text-muted text-sm">to</span>
              <Input
                type="number"
                placeholder="Max"
                size="sm"
                value={maxReferrals}
                onChange={(e) => setMaxReferrals(e.target.value)}
              />
            </div>
          </div>

          {/* Payments Count Range */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Successful Payments Count
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                size="sm"
                value={minPayments}
                onChange={(e) => setMinPayments(e.target.value)}
              />
              <span className="text-text-muted text-sm">to</span>
              <Input
                type="number"
                placeholder="Max"
                size="sm"
                value={maxPayments}
                onChange={(e) => setMaxPayments(e.target.value)}
              />
            </div>
          </div>

          {/* Total Donation Amount Range */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Total Amount Donated (₹)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min (₹)"
                size="sm"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
              <span className="text-text-muted text-sm">to</span>
              <Input
                type="number"
                placeholder="Max (₹)"
                size="sm"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Registration Date Range */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Registration Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="date"
                label="Joined After"
                size="sm"
                value={joinedAfter}
                onChange={(e) => setJoinedAfter(e.target.value)}
              />
              <Input
                type="date"
                label="Joined Before"
                size="sm"
                value={joinedBefore}
                onChange={(e) => setJoinedBefore(e.target.value)}
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

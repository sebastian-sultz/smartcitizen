"use client";

import React, { useEffect, useState } from "react";
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
import { VolunteerFilterParams } from "../types";

interface VolunteerFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: VolunteerFilterParams;
  onApply: (updatedFilters: VolunteerFilterParams) => void;
  onReset: () => void;
}

const COMMON_PROFESSIONS = [
  "All",
  "Medical & Healthcare",
  "Education & Teaching",
  "Engineering & IT",
  "Social Work & NGO",
  "Law & Legal",
  "Finance & Accounts",
  "Student",
  "Business & Entrepreneur",
  "Other",
];

export const VolunteerFiltersDialog: React.FC<VolunteerFiltersDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onApply,
  onReset,
}) => {
  const [status, setStatus] = useState("ALL");
  const [profession, setProfession] = useState("All");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!open) return;

    setStatus(filters.status || "ALL");
    setProfession(filters.profession || "All");
    setState(filters.state || "");
    setCity(filters.city || "");
    setStartDate(filters.startDate || "");
    setEndDate(filters.endDate || "");
  }, [open, filters]);

  const handleApply = () => {
    const updated: VolunteerFilterParams = {};

    if (status !== "ALL") updated.status = status;
    if (profession !== "All") updated.profession = profession;

    if (state.trim()) updated.state = state.trim();
    if (city.trim()) updated.city = city.trim();

    if (startDate) updated.startDate = startDate;
    if (endDate) updated.endDate = endDate;

    onApply(updated);
    onOpenChange(false);
  };

  const handleReset = () => {
    setStatus("ALL");
    setProfession("All");
    setState("");
    setCity("");
    setStartDate("");
    setEndDate("");

    onReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Advanced Volunteer Filters</DialogTitle>

          <DialogDescription>
            Filter volunteer applicants by status, location, profession, and
            application timeline.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 py-5 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercasetext-text-muted">
              Application Status
            </label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger size="sm" className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercasetext-text-muted">
              Profession / Domain
            </label>

            <Select value={profession} onValueChange={setProfession}>
              <SelectTrigger size="sm" className="w-full">
                <SelectValue placeholder="All Professions" />
              </SelectTrigger>

              <SelectContent position="popper">
                {COMMON_PROFESSIONS.map((prof) => (
                  <SelectItem key={prof} value={prof}>
                    {prof}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercasetext-text-muted">
              State / Region
            </label>

            <Input
              size="sm"
              value={state}
              placeholder="e.g. Maharashtra"
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercasetext-text-muted">
              City / District
            </label>

            <Input
              size="sm"
              value={city}
              placeholder="e.g. Mumbai"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-bold uppercasetext-text-muted">
              Application Date Range
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                type="date"
                label="Applied After"
                size="sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <Input
                type="date"
                label="Applied Before"
                size="sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleReset}
            >
              Reset Filters
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

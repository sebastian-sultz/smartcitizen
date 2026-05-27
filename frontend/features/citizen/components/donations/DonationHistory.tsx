"use client";

import { useState } from "react";
import { DonationRecord } from "../../types";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Eye, Download, Receipt } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";

interface DonationHistoryProps {
  donations: DonationRecord[];
  loading: boolean;
  onViewDetails: (donation: DonationRecord) => void;
  onFilterChange: (filters: { search: string; status: string }) => void;
}

export default function DonationHistory({
  donations,
  loading,
  onViewDetails,
  onFilterChange,
}: DonationHistoryProps) {
  const { showAlert } = useAlert();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onFilterChange({ search: val, status });
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    onFilterChange({ search, status: val });
  };

  const getStatusBadge = (status: DonationRecord["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="success" className="font-bold text-[10px] px-2 py-0.5">SUCCESS</Badge>;
      case "pending":
        return <Badge variant="warning" className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] px-2 py-0.5">PENDING</Badge>;
      default:
        return <Badge variant="destructive" className="font-bold text-[10px] px-2 py-0.5">FAILED</Badge>;
    }
  };

  const tableHeaders: Header<DonationRecord>[] = [
    {
      label: "Date",
      render: (row) => (
        <span className="text-xs font-semibold text-text">
          {new Date(row.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "Transaction ID",
      render: (row) => (
        <span className="font-mono text-xs text-text-muted font-bold tracking-tight">
          {row.transactionId}
        </span>
      ),
    },
    {
      label: "Campaign / Purpose",
      render: (row) => (
        <span className="text-xs font-semibold text-text truncate max-w-[200px] block">
          {row.purpose}
        </span>
      ),
    },
    {
      label: "Amount",
      render: (row) => (
        <span className="text-xs font-black text-text">
          ₹{row.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={() => onViewDetails(row)}
            className="p-2 h-auto text-primary hover:bg-primary/5 rounded-lg"
            aria-label={`View transaction ${row.transactionId} details`}
          >
            <Eye size={14} />
          </Button>
          {row.status === "success" && (
            <Button
              variant="outline"
              onClick={() =>
                showAlert({
                  title: "Generating PDF",
                  message: "Downloading tax receipt PDF...",
                  type: "success",
                })
              }
              className="px-3 py-1.5 h-auto text-[11px] border-primary/10 text-primary rounded-xl"
              aria-label={`Download PDF receipt for transaction ${row.transactionId}`}
            >
              <Download size={12} className="mr-1.5 inline shrink-0" />
              Receipt
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={16} />
          </span>
          <Input
            className="pl-10 rounded-2xl"
            placeholder="Search by Transaction ID or Campaign..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Status Select dropdown */}
        <div className="flex gap-1.5 bg-bg/60 p-1.5 rounded-2xl border border-border">
          {["all", "success", "pending", "failed"].map((s) => (
            <Button
              key={s}
              type="button"
              variant={status === s ? "secondary" : "ghost"}
              size="xs"
              onClick={() => handleStatusChange(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all capitalize ${
                status === s
                  ? "bg-white text-primary shadow-sm hover:bg-white"
                  : "text-text-muted hover:text-text hover:bg-transparent"
              }`}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-border/80 bg-white rounded-3xl overflow-hidden shadow-sm">
        <TableComponent
          headers={tableHeaders}
          data={donations}
          loading={loading}
          emptyMessage="No donation records found matching the criteria."
        />
      </div>
    </div>
  );
}

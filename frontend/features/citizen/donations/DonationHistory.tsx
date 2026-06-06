"use client";

import { useState } from "react";
import { Payment } from "../types";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import EmptyState from "@/components/ui/EmptyState";
import { Search, Eye, Filter, Download, Heart } from "lucide-react";
import DonationDetailModal from "./DonationDetailModal";
import { cn, formatDate } from "@/lib/utils";
import { getStatusColor } from "./helpers";
import { toast } from "sonner";

interface DonationHistoryProps {
  donations: Payment[];
  loading?: boolean;
}

export default function DonationHistory({ donations, loading = false }: DonationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<Payment | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter Logic
  const filteredDonations = donations.filter((item) => {
    const matchesSearch = item.merchantOrderId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" ||
      item.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // getStatusColor is imported from helpers.ts

  const handleViewDetails = (donation: Payment) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const tableHeaders: Header<Payment>[] = [
    {
      label: "Date",
      render: (row) => (
        <span className="font-semibold text-text">
          {formatDate(row.createdAt, "short")}
        </span>
      ),
    },
    {
      label: "Transaction ID",
      render: (row) => (
        <span className="font-mono text-xs font-bold text-text-muted">
          {row.merchantOrderId}
        </span>
      ),
    },
    {
      label: "Amount",
      render: (row) => (
        <span
          className={cn(
            "font-display font-black",
            row.status.toLowerCase() === "success"
              ? "text-primary"
              : "text-text",
          )}
        >
          ₹{(row.amount / 100).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <Badge variant={getStatusColor(row.status)} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      label: "Action",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleViewDetails(row)}
            variant="outline"
            size="sm"
            startIcon={<Eye size={12} />}
            className="border-primary/20 text-primary hover:bg-primary/5 font-bold"
          >
            Details
          </Button>
          {row.status.toLowerCase() === "success" && (
            <Button
              onClick={() => {
                toast.success(
                  `Downloading receipt for transaction ${row.merchantOrderId}`,
                );
              }}
              variant="primary"
              size="sm"
              startIcon={<Download size={12} />}
              className="font-bold"
            >
              Receipt
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (!loading && donations.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No Donations Found"
        description="You have not made any donations yet. Join hands with us to fund public assemblies, drives, and local community initiatives!"
        ctaText="Make Your First Donation"
        ctaHref="/donation"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtering Header Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg/20 p-4 border border-border/60 rounded-3xl">
        <div className="w-full md:max-w-xs relative">
          <Input
            placeholder="Search transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-2 text-sm"
            icon={<Search size={18} className="text-text-muted" />}
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-muted text-xs font-bold shrink-0">
            <Filter size={14} />
            Filter
          </div>
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="px-4 py-2 text-xs rounded-xl h-auto border-border">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main TableComponent */}
      <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-sm">
        <TableComponent
          headers={tableHeaders}
          data={filteredDonations}
          loading={loading}
          emptyMessage="No transaction records match your filters."
        />
      </div>

      {/* Detail Dialog Drawer */}
      <DonationDetailModal
        donation={selectedDonation}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

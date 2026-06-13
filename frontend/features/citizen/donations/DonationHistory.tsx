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
import { cn, formatDate, downloadBlob } from "@/lib/utils";
import { getStatusColor } from "./helpers";
import { toast } from "sonner";
import { getReceiptStatus } from "../api";

interface DonationHistoryProps {
  donations: Payment[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPaginationChange: (page: number, limit: number) => void;
  onRefresh?: () => void;
}

export default function DonationHistory({
  donations,
  loading = false,
  page,
  limit,
  total,
  onPaginationChange,
  onRefresh,
}: DonationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<Payment | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadingReceiptId, setDownloadingReceiptId] = useState<string | null>(null);

  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      setDownloadingReceiptId(transactionId);
      const res = await getReceiptStatus(transactionId);
      if (res && res.url) {
        downloadBlob(res.url, `80G_Receipt_${transactionId}.pdf`);
      } else if (res && res.status === "processing") {
        toast.info("Your tax receipt is still being compiled. Please wait a moment...");
      } else {
        toast.error("Receipt is currently unavailable.");
      }
    } catch {
      toast.error("Failed to fetch receipt. Please try again.");
    } finally {
      setDownloadingReceiptId(null);
    }
  };

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

  const handleViewDetails = (donation: Payment) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const tableHeaders: Header<Payment>[] = [
    {
      label: "Date",
      render: (row) => (
        <span className="font-bold text-text-light">
          {formatDate(row.createdAt, "short")}
        </span>
      ),
    },
    {
      label: "Transaction ID",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center shrink-0">
            <Heart size={14} className="text-accent" fill="currentColor" />
          </div>
          <span className="font-mono text-xs font-bold text-text-muted select-all">
            {row.merchantOrderId}
          </span>
        </div>
      ),
    },
    {
      label: "Amount",
      render: (row) => (
        <span
          className={cn(
            "font-display font-black text-base",
            row.status.toLowerCase() === "success"
              ? "text-primary"
              : "text-text",
          )}
        >
          ₹{(row.amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <Badge variant={getStatusColor(row.status)} size="md">
          {row.status}
        </Badge>
      ),
    },
    {
      label: "Tax Status",
      render: (row) => {
        if (row.status.toLowerCase() !== "success") {
          return <span className="text-text-muted text-xs font-semibold">-</span>;
        }
        const isEligible = !!(row.donorPan && row.donorAddress);
        return (
          <Badge variant={isEligible ? "success" : "warning"} size="md">
            {isEligible ? "Tax Eligible" : "Pending Details"}
          </Badge>
        );
      },
    },
    {
      label: "Action",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleViewDetails(row)}
            variant="secondary"
            size="sm"
            startIcon={<Eye size={12} />}
            className="text-xs font-bold border border-border py-1.5 px-3 h-auto"
          >
            Details
          </Button>
          {row.status.toLowerCase() === "success" && (
            <Button
              onClick={() => handleDownloadReceipt(row.merchantOrderId)}
              variant="primary"
              size="sm"
              isLoading={downloadingReceiptId === row.merchantOrderId}
              startIcon={<Download size={12} />}
              className="text-xs font-bold py-1.5 px-3 h-auto"
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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-border rounded-3xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]">
        <div className="w-full md:max-w-xs relative">
          <Input
            placeholder="Search transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            icon={<Search size={16} className="text-text-light" />}
            className="bg-bg/40 focus:bg-white"
          />
        </div>

        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 self-stretch md:self-auto">
          <div className="flex items-center gap-2 text-text-muted text-xs font-bold shrink-0">
            <Filter size={14} />
            Filter
          </div>
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="px-4 py-2 text-xs rounded-xl h-9 border-border bg-bg/50 focus:border-primary font-bold">
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
      <div className="overflow-hidden">
        <TableComponent
          headers={tableHeaders}
          data={filteredDonations}
          loading={loading}
          emptyMessage="No transaction records match your filters."
          pagination={{
            page,
            limit,
            total,
            onChange: onPaginationChange,
          }}
        />
      </div>

      {/* Detail Dialog Drawer */}
      <DonationDetailModal
        donation={selectedDonation}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRefresh={onRefresh}
      />
    </div>
  );
}

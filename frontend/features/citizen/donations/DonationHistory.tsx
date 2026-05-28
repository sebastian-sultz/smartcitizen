"use client";

import { useState } from "react";
import { DonationRecord } from "../types";
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
import { Search, Eye, Filter, ArrowUpDown } from "lucide-react";
import DonationDetailModal from "./DonationDetailModal";
import { formatDate } from "@/lib/utils";

interface DonationHistoryProps {
  donations: DonationRecord[];
  loading?: boolean;
}

export default function DonationHistory({ donations, loading = false }: DonationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter Logic
  const filteredDonations = donations.filter((item) => {
    const matchesSearch = 
      item.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: DonationRecord["status"]) => {
    switch (status) {
      case "success": return "success";
      case "pending": return "warning";
      default: return "danger";
    }
  };

  const handleViewDetails = (donation: DonationRecord) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const tableHeaders: Header<DonationRecord>[] = [
    {
      label: "Date",
      render: (row) => (
        <span className="font-semibold text-text">
          {formatDate(row.date, "short")}
        </span>
      ),
    },
    {
      label: "Transaction ID",
      render: (row) => <span className="font-mono text-xs font-bold text-text-muted">{row.transactionId}</span>,
    },
    {
      label: "Amount",
      render: (row) => <span className="font-display font-black text-text">₹{row.amount.toLocaleString("en-IN")}</span>,
    },
    {
      label: "Purpose",
      render: (row) => <span className="font-medium text-text-muted text-[13px]">{row.purpose}</span>,
    },
    {
      label: "Status",
      render: (row) => (
        <Badge variant={getStatusColor(row.status)} className="font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">
          {row.status}
        </Badge>
      ),
    },
    {
      label: "Action",
      render: (row) => (
        <Button
          onClick={() => handleViewDetails(row)}
          variant="outline"
          size="sm"
          className="text-xs font-bold py-1.5 h-auto rounded-xl gap-1 border-primary/20 text-primary hover:bg-primary/5"
        >
          <Eye size={12} />
          Details
        </Button>
      ),
    },
  ];

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

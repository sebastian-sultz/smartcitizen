"use client";

import { useState } from "react";
import { ReferralMember } from "../../types";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, User } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface ReferredMembersTableProps {
  members: ReferralMember[];
  loading?: boolean;
}

export default function ReferredMembersTable({ members, loading = false }: ReferredMembersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredMembers = members.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReferralMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wide px-2 py-0.5">Active</Badge>;
      case "registered":
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[9px] uppercase tracking-wide px-2 py-0.5">Registered</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase tracking-wide px-2 py-0.5">Invited</Badge>;
    }
  };

  const getDonationBadge = (donationStatus: ReferralMember["donationStatus"]) => {
    if (donationStatus === "donated") {
      return <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wide px-2 py-0.5">Donated</Badge>;
    }
    return <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase tracking-wide px-2 py-0.5">None</Badge>;
  };

  const headers: Header<ReferralMember>[] = [
    {
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0 relative overflow-hidden">
            {row.avatarUrl ? (
              <Image src={row.avatarUrl} alt={row.name} fill className="object-cover" sizes="32px" />
            ) : (
              row.name.charAt(0).toUpperCase()
            )}
          </div>
          <span className="font-bold text-sm text-text truncate max-w-[120px] sm:max-w-none">{row.name}</span>
        </div>
      ),
    },
    {
      label: "Join Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      label: "Donation Status",
      render: (row) => getDonationBadge(row.donationStatus),
    },
    {
      label: "Contributions Generated",
      render: (row) => (
        <span className="font-display font-black text-text text-sm">
          ₹{row.totalDonated.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      label: "Registration Date",
      render: (row) => (
        <span className="text-[12px] text-text-muted font-medium">
          {formatDate(row.registrationDate, "short")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filtering Options */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg/20 p-4 border border-border/60 rounded-3xl">
        <div className="w-full md:max-w-xs relative">
          <Input
            placeholder="Search referred member..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Referred Members Table */}
      <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-sm">
        <TableComponent
          headers={headers}
          data={filteredMembers}
          loading={loading}
          emptyMessage="No referred citizens match your filter criteria."
        />
      </div>
    </div>
  );
}

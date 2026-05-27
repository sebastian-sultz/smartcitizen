"use client";

import { useState } from "react";
import { ReferralMember } from "../../types";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Search, CircleUser, UserCheck, Calendar } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface ReferredMembersTableProps {
  members: ReferralMember[];
  loading: boolean;
  onFilterChange: (filters: { search: string; status: string }) => void;
}

export default function ReferredMembersTable({
  members,
  loading,
  onFilterChange,
}: ReferredMembersTableProps) {
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

  const getStatusBadge = (status: ReferralMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wider">ACTIVE</Badge>;
      case "registered":
        return <Badge variant="secondary" className="bg-primary/5 text-primary border border-primary/10 font-bold text-[9px] uppercase tracking-wider">REGISTERED</Badge>;
      default:
        return <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-wider">INVITED</Badge>;
    }
  };

  const tableHeaders: Header<ReferralMember>[] = [
    {
      label: "Name / Avatar",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/5 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-text">{row.name}</span>
        </div>
      ),
    },
    {
      label: "Registration Date",
      render: (row) => (
        <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
          <Calendar size={12} className="opacity-70" />
          {new Date(row.registrationDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      label: "Donations Status",
      render: (row) => (
        <span className={`text-xs font-bold ${
          row.donationStatus === "donated" ? "text-green-600" : "text-text-muted"
        }`}>
          {row.donationStatus === "donated" ? "Has Contributed" : "No donation"}
        </span>
      ),
    },
    {
      label: "Total Contributions",
      render: (row) => (
        <span className="text-xs font-black text-text">
          {row.totalDonated > 0 ? `₹${row.totalDonated.toLocaleString("en-IN")}` : "₹0"}
        </span>
      ),
    },
    {
      label: "Last Active",
      render: (row) => (
        <span className="text-xs text-text-muted font-semibold">
          {new Date(row.lastActivityDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={16} />
          </span>
          <Input
            className="pl-10 rounded-2xl"
            placeholder="Search by referred name..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Status filters selection tab */}
        <div className="flex gap-1.5 bg-bg/60 p-1.5 rounded-2xl border border-border">
          {["all", "active", "registered", "invited"].map((s) => (
            <Button
              key={s}
              type="button"
              variant={status === s ? "secondary" : "ghost"}
              size="xs"
              onClick={() => handleStatusChange(s)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all capitalize ${
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
          data={members}
          loading={loading}
          emptyMessage="No referred connections found matching the criteria."
        />
      </div>
    </div>
  );
}

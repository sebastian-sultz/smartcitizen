"use client";

import { useState } from "react";
import { SupportTicket } from "../../types";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlusCircle, MessageSquare, ShieldAlert, ArrowRight, Eye, Calendar } from "lucide-react";

interface TicketListProps {
  tickets: SupportTicket[];
  loading: boolean;
  onViewTicket: (ticket: SupportTicket) => void;
  onCreateTicketClick: () => void;
}

export default function TicketList({
  tickets,
  loading,
  onViewTicket,
  onCreateTicketClick,
}: TicketListProps) {
  const [status, setStatus] = useState("all");

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "resolved":
        return <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wider">RESOLVED</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[9px] uppercase tracking-wider font-semibold">IN PROGRESS</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-text-muted border-border font-bold text-[9px] uppercase tracking-wider">CLOSED</Badge>;
      default:
        return <Badge variant="warning" className="bg-amber-100 text-amber-700 border-none font-bold text-[9px] uppercase tracking-wider">OPEN</Badge>;
    }
  };

  const getPriorityColor = (prio: SupportTicket["priority"]) => {
    switch (prio) {
      case "high": return "text-rose-600 bg-rose-50 border-rose-100";
      case "medium": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  const filteredTickets = tickets.filter(
    (t) => status === "all" || t.status === status
  );

  const tableHeaders: Header<SupportTicket>[] = [
    {
      label: "Ticket ID",
      render: (row) => (
        <span className="font-mono text-xs text-text font-bold">
          {row.ticketId}
        </span>
      ),
    },
    {
      label: "Category",
      render: (row) => (
        <span className="text-xs font-bold text-text-muted capitalize">
          {row.category}
        </span>
      ),
    },
    {
      label: "Subject",
      render: (row) => (
        <span className="text-xs font-semibold text-text truncate max-w-[220px] block">
          {row.subject}
        </span>
      ),
    },
    {
      label: "Priority",
      render: (row) => (
        <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded-md tracking-wider ${getPriorityColor(row.priority)}`}>
          {row.priority}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      label: "Last Activity",
      render: (row) => (
        <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
          <Calendar size={12} className="opacity-70" />
          {new Date(row.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "Actions",
      render: (row) => (
        <div className="text-right">
          <Button
            variant="outline"
            onClick={() => onViewTicket(row)}
            className="px-3 py-1.5 h-auto text-xs font-bold gap-1 rounded-xl border-primary/10 text-primary"
            aria-label={`View ticket ${row.ticketId} details`}
          >
            <Eye size={12} />
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* Toggle filters */}
        <div className="flex gap-1.5 bg-bg/60 p-1.5 rounded-2xl border border-border">
          {["all", "open", "in_progress", "resolved"].map((s) => (
            <Button
              key={s}
              type="button"
              variant={status === s ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setStatus(s)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all capitalize whitespace-nowrap ${
                status === s
                  ? "bg-white text-primary shadow-sm hover:bg-white"
                  : "text-text-muted hover:text-text hover:bg-transparent"
              }`}
            >
              {s.replace("_", " ")}
            </Button>
          ))}
        </div>

        <Button
          onClick={onCreateTicketClick}
          className="bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 py-3 px-4 rounded-xl h-auto text-xs w-full sm:w-auto border-none"
        >
          <PlusCircle size={14} />
          Create Support Request
        </Button>
      </div>

      {/* Reusable table component */}
      <div className="border border-border/80 bg-white rounded-3xl overflow-hidden shadow-sm">
        <TableComponent
          headers={tableHeaders}
          data={filteredTickets}
          loading={loading}
          emptyMessage="No support tickets logged matching the category."
        />
      </div>
    </div>
  );
}

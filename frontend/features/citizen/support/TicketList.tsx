"use client";

import { SupportTicket } from "../types";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Eye } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { getTicketStatusBadge } from "./ticket-utils";

interface TicketListProps {
  tickets: SupportTicket[];
  onSelectTicket: (ticket: SupportTicket) => void;
  onCreateTrigger: () => void;
  loading?: boolean;
}

export default function TicketList({ tickets, onSelectTicket, onCreateTrigger, loading = false }: TicketListProps) {
  

  const headers: Header<SupportTicket>[] = [
    {
      label: "Date",
      render: (row) => (
        <span className="font-semibold text-text">
          {formatDate(row.created_at, "short")}
        </span>
      ),
    },
    {
      label: "Ticket ID",
      render: (row) => <span className="font-mono text-xs font-bold text-text-muted">SC-{row.id.substring(0, 5).toUpperCase()}</span>,
    },
    {
      label: "Subject",
      render: (row) => {
        const cleanReason = row.reason.replace(/^\[[A-Z]+\]\s*/, "");
        const subject = cleanReason.split(":")[0] || cleanReason;
        return (
          <span className="font-bold text-text text-sm truncate max-w-[120px] sm:max-w-[200px] block">
            {subject}
          </span>
        );
      },
    },
    {
      label: "Category",
      render: (row) => {
        const match = row.reason.match(/^\[([A-Z]+)\]/);
        const category = match ? match[1].toLowerCase() : "general";
        return <span className="font-medium text-text-muted text-xs capitalize">{category}</span>;
      },
    },
    {
      label: "Status",
      render: (row) => getTicketStatusBadge(row.status),
    },
    {
      label: "Action",
      render: (row) => (
        <Button
          onClick={() => onSelectTicket(row)}
          variant="outline"
          size="sm"
          className="text-xs font-bold py-1.5 h-auto rounded-xl gap-1 border-primary/20 text-primary hover:bg-primary/5"
        >
          <Eye size={12} />
          Open Chat
        </Button>
      ),
    },
  ];

  if (tickets.length === 0 && !loading) {
    return (
      <div className="bg-white border border-border/80 rounded-3xl p-8">
        <EmptyState
          icon={MessageSquare}
          title="No support tickets logged"
          description="Have questions about donation certificates, district cleanups, or volunteer status? Lodge a support ticket."
          ctaText="Submit Support Ticket"
          onClick={onCreateTrigger}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display text-lg font-bold text-text">Lodge Records</h3>
          <p className="text-text-muted text-xs mt-0.5 font-medium">History of communication logs with the NGO coordination desk.</p>
        </div>
        <Button
          onClick={onCreateTrigger}
          className="text-xs font-bold py-2.5 px-4 h-auto rounded-xl shadow-sm"
        >
          Lodge Ticket
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-sm">
        <TableComponent
          headers={headers}
          data={tickets}
          loading={loading}
          emptyMessage="No logged support tickets found."
        />
      </div>
    </div>
  );
}

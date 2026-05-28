"use client";

import { SupportTicket } from "../../types";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Eye, ShieldAlert } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

interface TicketListProps {
  tickets: SupportTicket[];
  onSelectTicket: (ticket: SupportTicket) => void;
  onCreateTrigger: () => void;
  loading?: boolean;
}

export default function TicketList({ tickets, onSelectTicket, onCreateTrigger, loading = false }: TicketListProps) {
  
  const getPriorityBadge = (prio: SupportTicket["priority"]) => {
    switch (prio) {
      case "high":
        return <Badge variant="danger" className="font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">High</Badge>;
      case "medium":
        return <Badge variant="warning" className="font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">Medium</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">Low</Badge>;
    }
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="default" className="font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">Open</Badge>;
      case "in_progress":
        return <Badge variant="warning" className="font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">In Progress</Badge>;
      case "resolved":
        return <Badge variant="success" className="font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">Resolved</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase px-2 py-0.5 tracking-wider">Closed</Badge>;
    }
  };

  const headers: Header<SupportTicket>[] = [
    {
      label: "Date",
      render: (row) => (
        <span className="font-semibold text-text">
          {formatDate(row.createdAt, "short")}
        </span>
      ),
    },
    {
      label: "Ticket ID",
      render: (row) => <span className="font-mono text-xs font-bold text-text-muted">{row.ticketId}</span>,
    },
    {
      label: "Subject",
      render: (row) => <span className="font-bold text-text text-sm truncate max-w-[120px] sm:max-w-[200px] block">{row.subject}</span>,
    },
    {
      label: "Category",
      render: (row) => <span className="font-medium text-text-muted text-xs capitalize">{row.category}</span>,
    },
    {
      label: "Priority",
      render: (row) => getPriorityBadge(row.priority),
    },
    {
      label: "Status",
      render: (row) => getStatusBadge(row.status),
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

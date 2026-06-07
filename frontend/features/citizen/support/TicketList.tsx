"use client";

import { SupportTicket } from "@/features/shared/reports";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, MessageSquare } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { getTicketStatusBadge } from "./ticket-utils";

interface TicketListProps {
  tickets: SupportTicket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: SupportTicket) => void;
  onCreateTrigger: () => void;
  isCreating: boolean;
}

export default function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onCreateTrigger,
  isCreating,
}: TicketListProps) {
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header and Create Button */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h3 className="font-display text-base font-bold text-text">Support Inbox</h3>
          <p className="text-text-muted text-[11px] font-medium">History of your support reports</p>
        </div>
        <Button
          onClick={onCreateTrigger}
          size="sm"
          variant={isCreating ? "outline" : "primary"}
          className="text-xs font-bold py-2 px-3 h-auto rounded-xl flex items-center gap-1 border-primary/20"
        >
          <Plus size={14} />
          New Issue
        </Button>
      </div>

      {/* Ticket Cards Stack */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 min-h-0">
        {tickets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-bg/10 rounded-3xl border border-dashed border-border/60">
            <MessageSquare className="size-8 text-text-muted opacity-40 mb-2" />
            <p className="text-xs font-bold text-text-muted">No support records</p>
            <p className="text-[10px] text-text-muted/80 mt-1 max-w-[180px]">
              Lodge a support ticket to get help from our team.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const isActive = !isCreating && selectedTicketId === ticket.id;
            
            const subject = ticket.title;

            // Get last message snippet (falls back to issue description if no reply messages exist)
            const lastMessage = ticket.messages && ticket.messages.length > 0
              ? ticket.messages[ticket.messages.length - 1].message
              : ticket.description;

            return (
              <button
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={cn(
                  "w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-2 relative group focus:outline-none",
                  isActive
                    ? "bg-primary/5 border-primary/30 shadow-sm ring-1 ring-primary/10"
                    : "bg-white border-border/80 hover:border-primary/20 hover:bg-bg/40"
                )}
              >
                {/* Header row: Date */}
                <div className="flex justify-end items-center w-full">
                  <span className="text-[9px] text-text-muted/80 font-semibold">
                    {formatDate(ticket.created_at, "short")}
                  </span>
                </div>

                {/* Subject and Status */}
                <div>
                  <h4 className="font-bold text-sm text-text truncate pr-2">
                    {subject}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    {getTicketStatusBadge(ticket.status)}
                  </div>
                </div>

                {/* Latest message snippet */}
                {lastMessage && (
                  <p className="text-[11px] text-text-muted truncate mt-0.5 max-w-full font-medium italic">
                    "{lastMessage}"
                  </p>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

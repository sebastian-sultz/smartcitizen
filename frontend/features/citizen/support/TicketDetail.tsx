"use client";

import { useState } from "react";
import { SupportTicket } from "../types";
import { addReportMessage, getReport } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { getTicketStatusBadge } from "./ticket-utils";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface TicketDetailProps {
  ticket: SupportTicket;
  onBack: () => void;
  onUpdateTicket: (updated: SupportTicket) => void;
}

export default function TicketDetail({ ticket, onBack, onUpdateTicket }: TicketDetailProps) {
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { session } = useAuthStore();
  const currentUserId = session?.userId;


  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await addReportMessage(ticket.id, { message: replyText });
      const res = await getReport(ticket.id);
      onUpdateTicket(res.report);
      setReplyText("");
      toast.success("Reply posted successfully!");
    } catch (err) {
      console.error("Failed to post reply:", err);
      toast.error("Failed to post message.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = formatDate(ticket.created_at, "medium");
  const match = ticket.reason.match(/^\[([A-Z]+)\]/);
  const category = match ? match[1].toLowerCase() : "general";
  const cleanReason = ticket.reason.replace(/^\[[A-Z]+\]\s*/, "");
  const subject = cleanReason.split(":")[0] || cleanReason;

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden flex flex-col h-[600px]">
      
      {/* Header Info */}
      <CardHeader className="border-b border-border/80 pb-4 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost-muted"
            size="icon-sm"
            shape="circle"
            title="Back to Tickets"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-mono text-xs font-bold text-text-muted">SC-{ticket.id.substring(0, 5).toUpperCase()}</span>
              <h3 className="font-display font-black text-text text-sm sm:text-base truncate max-w-[150px] sm:max-w-xs">
                {subject}
              </h3>
            </div>
            <p className="text-[10px] text-text-muted mt-0.5 font-medium">
              Lodged on {formattedDate} &bull; Category: <span className="capitalize">{category}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          {getTicketStatusBadge(ticket.status)}
        </div>
      </CardHeader>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-bg/20">
        {ticket.messages?.map((msg) => {
          const isUser = msg.sender_id === currentUserId;
          const senderLabel = isUser ? "You" : "Coordinator";
          return (
            <div 
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0 relative overflow-hidden">
                {senderLabel.charAt(0)}
              </div>
              
              <div className="space-y-1">
                <div className={cn(
                  "p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                  isUser ? "bg-primary text-white rounded-tr-none" : "bg-white text-text border border-border/60 rounded-tl-none"
                )}>
                  <p>{msg.message}</p>
                </div>
                <p className={cn(
                  "text-[9px] text-text-muted/70 font-mono font-bold px-1.5",
                  isUser ? "text-right" : "text-left"
                )}>
                  {new Date(msg.created_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Text reply box input */}
      <CardContent className="border-t border-border/80 p-4 bg-white shrink-0">
        {ticket.status === "Closed" || ticket.status === "Resolved" ? (
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold justify-center">
            <AlertCircle size={15} />
            This ticket is marked as {ticket.status.toLowerCase()}. Reopen it by sending a message.
          </div>
        ) : null}

        <form onSubmit={handleSendReply} className="flex gap-3 mt-1">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="py-3 px-4 text-sm"
              disabled={submitting}
            />
          </div>
          <Button
            type="submit"
            disabled={!replyText.trim() || submitting}
            isLoading={submitting}
            startIcon={<Send size={14} />}
            className="shrink-0"
          >
            Send
          </Button>
        </form>
      </CardContent>

    </Card>
  );
}

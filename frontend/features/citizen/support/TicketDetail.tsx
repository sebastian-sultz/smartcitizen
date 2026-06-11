"use client";

import { useState, useEffect, useRef } from "react";
import { SupportTicket, addReportMessage, getReport } from "@/features/shared/reports";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { getTicketStatusBadge } from "./ticket-utils";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchFreshMessages = async () => {
      try {
        const res = await getReport(ticket.id);
        onUpdateTicket(res.report);
      } catch (err) {
        console.error("Failed to load fresh messages:", err);
      }
    };
    fetchFreshMessages();
    
    const interval = setInterval(fetchFreshMessages, 5000);
    return () => clearInterval(interval);
  }, [ticket.id]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await addReportMessage(ticket.id, { message: replyText });
      const res = await getReport(ticket.id);
      onUpdateTicket(res.report);
      setReplyText("");
    } catch (err: any) {
      console.error("Failed to post reply:", err);
      toast.error(`Failed to send message: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = formatDate(ticket.created_at, "medium");
  const subject = ticket.title;

  return (
    <Card className="flex flex-col h-full bg-bg/10 rounded-[30px] border border-border/80 shadow-none overflow-hidden">
      
      {/* Header Info */}
      <div className="bg-white border-b border-border/80 px-6 py-4 flex flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost-muted"
            size="icon-sm"
            shape="circle"
            className="md:hidden"
            title="Back to Tickets"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-display font-bold text-text text-sm sm:text-base truncate max-w-[150px] sm:max-w-xs">
                {subject}
              </h3>
            </div>
            <p className="text-[10px] text-text-muted mt-0.5 font-medium">
              Lodged on {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          {getTicketStatusBadge(ticket.status)}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {ticket.messages?.map((msg) => {
          const isUser = msg.sender_id === currentUserId;
          const senderLabel = isUser ? "You" : "Coordinator";
          return (
            <div 
              key={msg.id}
              className={cn(
                "flex gap-2.5 max-w-[85%]",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary shrink-0 relative overflow-hidden">
                {senderLabel.charAt(0)}
              </div>
              
              <div className="space-y-1">
                <div className={cn(
                  "p-3 rounded-2xl text-sm leading-relaxed shadow-sm font-medium",
                  isUser ? "bg-primary text-white rounded-tr-none" : "bg-white text-text border border-border/60 rounded-tl-none"
                )}>
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
                <p className={cn(
                  "text-[8px] text-text-muted/70 font-mono font-bold px-1.5",
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
        <div ref={messagesEndRef} />
      </div>

      {/* Text reply box input */}
      <div className="border-t border-border/80 p-4 bg-white shrink-0">
        {ticket.status === "Closed" || ticket.status === "Resolved" ? (
          <div className="flex items-center gap-2 p-3 mb-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold justify-center">
            <AlertCircle size={14} />
            This ticket is resolved. Sending a message will reopen the chat.
          </div>
        ) : null}

        <form onSubmit={handleSendReply} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              size="sm"
              disabled={submitting}
            />
          </div>
          <Button
            type="submit"
            disabled={!replyText.trim() || submitting}
            isLoading={submitting}
            startIcon={<Send size={12} />}
            size="sm"
            className="shrink-0"
          >
            Send
          </Button>
        </form>
      </div>

    </Card>
  );
}

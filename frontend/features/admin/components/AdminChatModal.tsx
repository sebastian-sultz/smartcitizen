"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Send, AlertCircle } from "lucide-react";
import { SupportTicket, TicketMessage } from "@/features/citizen/types";
import { getReport, addReportMessage } from "@/features/citizen/api";
import { useAuthStore } from "@/store/authStore";
import { cn, formatDate } from "@/lib/utils";
import { getTicketStatusBadge } from "@/features/citizen/support/ticket-utils";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface AdminChatModalProps {
  ticket: SupportTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketUpdated?: (updated: SupportTicket) => void;
}

export default function AdminChatModal({
  ticket,
  open,
  onOpenChange,
  onTicketUpdated,
}: AdminChatModalProps) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { session } = useAuthStore();
  const currentUserId = session?.userId;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (silent = false) => {
    if (!ticket) return;
    try {
      if (!silent) setLoading(true);
      const res = await getReport(ticket.id);
      setMessages(res.report.messages || []);
    } catch (err: any) {
      console.error("Failed to load ticket messages for admin:", err);
      if (!silent) toast.error("Failed to load chat history.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (open && ticket) {
      loadMessages(false);
      const interval = setInterval(() => loadMessages(true), 5000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [open, ticket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !replyText.trim()) return;

    setSubmitting(true);
    try {
      await addReportMessage(ticket.id, { message: replyText });
      const res = await getReport(ticket.id);
      setMessages(res.report.messages || []);
      setReplyText("");
      
      if (onTicketUpdated) {
        onTicketUpdated(res.report);
      }
    } catch (err: any) {
      console.error("Failed to send message from admin:", err);
      toast.error(`Failed to send message: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!ticket) return null;

  const subject = ticket.title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[550px] flex flex-col p-6 gap-4">
        {/* Modal Header */}
        <DialogHeader className="border-b border-border/80 pb-3 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <DialogTitle className="font-display font-bold text-text text-base sm:text-lg">
                {subject}
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted mt-1 font-medium">
                Submitted by: {ticket.user?.name || "Anonymous User"}
              </DialogDescription>
            </div>
            <div className="shrink-0">{getTicketStatusBadge(ticket.status)}</div>
          </div>
        </DialogHeader>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-2xl bg-bg/25 border border-border/60 min-h-0">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Spinner className="size-6 text-primary" />
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isSelf = msg.sender_id === currentUserId;
                const senderLabel = isSelf ? "Admin (You)" : "User";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2.5 max-w-[85%]",
                      isSelf ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 border",
                        isSelf
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-surface border-border text-text-muted"
                      )}
                    >
                      {isSelf ? "A" : "U"}
                    </div>

                    <div className="space-y-1">
                      <div
                        className={cn(
                          "p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm font-medium",
                          isSelf
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white text-text border border-border/60 rounded-tl-none"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      </div>
                      <p
                        className={cn(
                          "text-[8px] text-text-muted/70 font-mono font-bold px-1.5",
                          isSelf ? "text-right" : "text-left"
                        )}
                      >
                        {new Date(msg.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Input */}
        <div className="pt-2 shrink-0 border-t border-border/60">
          {ticket.status === "Closed" || ticket.status === "Resolved" ? (
            <div className="flex items-center gap-1.5 p-2.5 mb-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[11px] font-bold justify-center">
              <AlertCircle size={13} />
              This ticket is resolved. Sending a message will reopen the chat.
            </div>
          ) : null}

          <form onSubmit={handleSendReply} className="flex gap-2.5">
            <div className="flex-1">
              <Input
                placeholder="Type administrator response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="py-2 px-3 text-xs sm:text-sm"
                disabled={submitting}
              />
            </div>
            <Button
              type="submit"
              disabled={!replyText.trim() || submitting}
              isLoading={submitting}
              startIcon={<Send size={12} />}
              className="shrink-0 text-xs font-bold py-2 px-4 h-auto rounded-xl"
            >
              Send
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

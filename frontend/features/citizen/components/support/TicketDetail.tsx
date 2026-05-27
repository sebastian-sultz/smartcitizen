"use client";

import { useEffect, useRef, useState } from "react";
import { SupportTicket } from "../../types";
import { replyToTicket } from "../../api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, MessageSquare, Send, Calendar, Clock, UserCheck } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";

interface TicketDetailProps {
  ticket: SupportTicket;
  onBack: () => void;
}

export default function TicketDetail({ ticket: initialTicket, onBack }: TicketDetailProps) {
  const { showAlert } = useAlert();
  const [ticket, setTicket] = useState<SupportTicket>(initialTicket);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      const text = replyText;
      setReplyText("");
      
      // Submit response to mock storage API
      const updated = await replyToTicket(ticket.id, text);
      if (updated) {
        setTicket(updated);
        
        // Simulating the async agent response notification in 2.5 seconds
        setTimeout(() => {
          // Append the agent message locally to simulate backend update
          const agentReply = {
            id: `msg_agent_${Date.now()}`,
            sender: "agent" as const,
            senderName: "Agent (Support Desk)",
            content: "We have updated your ticket status to 'In Progress'. A specialist has been assigned to verify this. We will contact you soon.",
            timestamp: new Date().toISOString(),
          };
          setTicket(prev => ({
            ...prev,
            status: "in_progress",
            updatedAt: new Date().toISOString(),
            messages: [...prev.messages, agentReply]
          }));
          
          showAlert({
            title: "Support Desk Response",
            message: "You have received a new update on ticket " + ticket.ticketId,
            type: "info",
          });
        }, 2200);
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "resolved":
        return <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wider">RESOLVED</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[9px] uppercase tracking-wider">IN PROGRESS</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-text-muted border-border font-bold text-[9px] uppercase tracking-wider">CLOSED</Badge>;
      default:
        return <Badge variant="warning" className="bg-amber-100 text-amber-700 border-none font-bold text-[9px] uppercase tracking-wider">OPEN</Badge>;
    }
  };

  const formattedCreated = new Date(ticket.createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      
      {/* Details Header Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-xl px-4 py-2.5 h-auto text-xs font-bold gap-1 border-primary/10 text-primary"
          aria-label="Go back to support requests list"
        >
          <ArrowLeft size={13} />
          All Requests
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-bold">Ticket: {ticket.ticketId}</span>
          {getStatusBadge(ticket.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Chat message room (left) */}
        <Card className="rounded-[40px] border-primary/5 shadow-sm lg:col-span-2 flex flex-col justify-between overflow-hidden h-[500px]">
          <CardHeader className="bg-bg border-b border-border py-4 px-6 shrink-0">
            <CardTitle className="font-display font-bold text-sm text-text truncate">
              {ticket.subject}
            </CardTitle>
          </CardHeader>

          {/* Messages scroll box */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-bg/15">
            {ticket.messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    isUser ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="text-[10px] text-text-muted/80 font-bold mb-1 px-1">
                    {msg.senderName}
                  </span>
                  
                  <div className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed ${
                    isUser 
                      ? "bg-primary text-white rounded-tr-none shadow-sm" 
                      : "bg-white text-text border border-border rounded-tl-none shadow-xs"
                  }`}>
                    {msg.content}
                  </div>

                  <span className="text-[9px] text-text-muted/60 mt-1 px-1 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply input text area */}
          <div className="p-4 bg-white border-t border-border shrink-0">
            <form onSubmit={handleSendReply} className="flex gap-2 items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                disabled={submitting || ticket.status === "closed"}
                className="flex-1 bg-bg p-3.5 rounded-2xl border border-border text-xs font-semibold outline-none focus:border-primary text-text"
              />
              <Button
                type="submit"
                disabled={submitting || !replyText.trim() || ticket.status === "closed"}
                className="bg-primary hover:bg-primary/95 text-white p-3.5 h-auto rounded-2xl border-none shrink-0"
                aria-label="Send reply message"
              >
                <Send size={15} />
              </Button>
            </form>
          </div>
        </Card>

        {/* Ticket Metadata side summary card (right) */}
        <Card className="rounded-[40px] border-primary/5 shadow-sm lg:col-span-1 p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h4 className="font-display font-bold text-sm text-text border-b border-border pb-3 flex items-center gap-1.5">
              <MessageSquare size={16} className="text-primary" />
              Ticket Details
            </h4>

            <div className="space-y-4 text-xs text-text-muted font-semibold">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Category</span>
                <span className="font-bold text-text text-sm capitalize mt-1 block">{ticket.category}</span>
              </div>
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Logged On</span>
                <span className="font-bold text-text flex items-center gap-1 mt-1">
                  <Calendar size={13} className="text-primary/70" />
                  {formattedCreated}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Priority</span>
                <span className="font-bold text-text flex items-center gap-1 mt-1 capitalize">
                  <Clock size={13} className="text-primary/70" />
                  {ticket.priority} Priority
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Assigned Agent</span>
                <span className="font-bold text-text flex items-center gap-1 mt-1">
                  <UserCheck size={13} className="text-primary/70" />
                  SmartCitizen Coordinator
                </span>
              </div>
            </div>
          </div>

          <div className="bg-bg/40 border border-border p-4 rounded-2xl text-[10px] text-text-muted leading-relaxed font-semibold">
            <span className="font-bold text-primary block mb-1">Response Guarantee:</span> 
            Our District Coordinators strive to respond within 12 hours. Urgent tickets are escalated directly to foundation admins.
          </div>
        </Card>

      </div>

    </div>
  );
}

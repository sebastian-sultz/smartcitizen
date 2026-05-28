"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getSupportTickets, getFAQs, createSupportTicket } from "../../api";
import { SupportTicket, FAQItem } from "../../types";

import FAQSection from "./FAQSection";
import TicketList from "./TicketList";
import CreateTicketForm from "./CreateTicketForm";
import TicketDetail from "./TicketDetail";

export default function SupportDashboard() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("faq");
  const [viewState, setViewState] = useState<"list" | "create" | "detail">("list");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const loadSupportData = async () => {
    try {
      setLoading(true);
      const [faqsData, ticketsData] = await Promise.all([
        getFAQs(),
        getSupportTickets()
      ]);
      setFaqs(faqsData);
      setTickets(ticketsData);
    } catch (err) {
      console.error("Failed to load help desk datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupportData();
  }, []);

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setViewState("detail");
  };

  const handleCreateTicket = async (values: {
    category: "account" | "donation" | "volunteer" | "technical" | "other";
    subject: string;
    description: string;
    priority: "low" | "medium" | "high";
  }) => {
    try {
      const newTkt = await createSupportTicket(values);
      setTickets([newTkt, ...tickets]);
      setViewState("list");
    } catch (err) {
      console.error("Failed to create ticket:", err);
      throw err;
    }
  };

  const handleUpdateTicket = (updated: SupportTicket) => {
    setTickets(tickets.map((t) => t.id === updated.id ? updated : t));
    setSelectedTicket(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="support">Help Desk & Lodge Desk</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <FAQSection faqs={faqs} />
        </TabsContent>

        <TabsContent value="support">
          {viewState === "create" ? (
            <CreateTicketForm 
              onSubmit={handleCreateTicket} 
              onCancel={() => setViewState("list")} 
            />
          ) : viewState === "detail" && selectedTicket ? (
            <TicketDetail 
              ticket={selectedTicket} 
              onBack={() => setViewState("list")} 
              onUpdateTicket={handleUpdateTicket}
            />
          ) : (
            <TicketList 
              tickets={tickets} 
              onSelectTicket={handleSelectTicket} 
              onCreateTrigger={() => setViewState("create")}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

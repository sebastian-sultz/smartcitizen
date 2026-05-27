"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getSupportTickets } from "../../api";
import { SupportTicket } from "../../types";
import { Spinner } from "@/components/ui/spinner";
import FAQSection from "./FAQSection";
import TicketList from "./TicketList";
import CreateTicketForm from "./CreateTicketForm";
import TicketDetail from "./TicketDetail";

export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState("faq");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getSupportTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets in dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketCreated = () => {
    fetchTickets();
    setViewState('list');
  };

  const handleViewTicketDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setViewState('detail');
  };

  const handleCreateTicketClick = () => {
    setActiveTab("helpdesk");
    setViewState('create');
  };

  return (
    <div className="space-y-6">
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-bg border border-border p-1 rounded-2xl w-full sm:w-auto flex overflow-x-auto justify-start sm:justify-center mb-6">
          <TabsTrigger value="faq" className="text-xs font-bold rounded-xl py-2.5 px-6">
            FAQ Section
          </TabsTrigger>
          <TabsTrigger value="helpdesk" className="text-xs font-bold rounded-xl py-2.5 px-6">
            Help Desk & Support Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="focus:outline-none">
          <FAQSection onCreateTicketClick={handleCreateTicketClick} />
        </TabsContent>

        <TabsContent value="helpdesk" className="focus:outline-none">
          {viewState === "create" ? (
            <CreateTicketForm 
              onSuccess={handleTicketCreated} 
              onCancel={() => setViewState('list')} 
            />
          ) : viewState === "detail" && selectedTicket ? (
            <TicketDetail 
              ticket={selectedTicket} 
              onBack={() => {
                fetchTickets(); // refresh list
                setViewState('list');
              }} 
            />
          ) : (
            <TicketList
              tickets={tickets}
              loading={loading}
              onViewTicket={handleViewTicketDetails}
              onCreateTicketClick={() => setViewState('create')}
            />
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCitizenStore } from "@/store/citizenStore";
import { useAuthStore } from "@/store/authStore";
import {
  getReport,
  createReport,
  addReportMessage,
  getUserReports,
  SupportTicket,
} from "@/features/shared/reports";

import { Card } from "@/components/ui/Card";
import TicketList from "./TicketList";
import CreateTicketForm from "./CreateTicketForm";
import TicketDetail from "./TicketDetail";

export default function SupportDashboard() {
  const { fetchProfile } = useCitizenStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mobileActivePane, setMobileActivePane] = useState<"list" | "detail" | "create">("list");

  const loadSupportData = async () => {
    try {
      setLoading(true);
      // Load user profile if not fetched yet (non-blocking)
      await fetchProfile();
      
      const fetchedReports = await getUserReports();
      setTickets(fetchedReports);
      
      // Auto-select the first ticket if available, otherwise default to the create form
      if (fetchedReports.length > 0) {
        setSelectedTicketId(fetchedReports[0].id);
        setIsCreating(false);
      } else {
        setIsCreating(true);
      }
    } catch (err) {
      console.error("Failed to load support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadSupportData();
    });
  }, []);

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicketId(ticket.id);
    setIsCreating(false);
    setMobileActivePane("detail");
  };

  const handleCreateTrigger = () => {
    setIsCreating(true);
    setMobileActivePane("create");
  };

  const handleCreateTicket = async (values: {
    subject: string;
    description: string;
  }) => {
    try {
      // 1. Create the support ticket report
      const reportRes = await createReport({
        title: values.subject,
        description: values.description,
      });
      
      if (!reportRes || !reportRes.report) {
        throw new Error("Failed to create support ticket in backend.");
      }
      
      const report = reportRes.report;

      // 2. Post first message containing description
      await addReportMessage(report.id, { message: values.description });

      // 3. Refresh list from backend directly
      const refreshedReports = await getUserReports();
      setTickets(refreshedReports);
      setSelectedTicketId(report.id);
      setIsCreating(false);
      setMobileActivePane("detail");
    } catch (err) {
      console.error("Failed to create ticket:", err);
      throw err;
    }
  };

  const handleUpdateTicket = (updated: SupportTicket) => {
    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleCancelCreate = () => {
    if (tickets.length > 0) {
      setIsCreating(false);
      setMobileActivePane("detail");
    } else {
      setMobileActivePane("list");
    }
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || null;

  if (loading) {
    return (
      <div className="w-full bg-white/60 backdrop-blur-md p-4 md:p-6 flex flex-col md:flex-row gap-6 rounded-card h-auto min-h-[500px] md:h-[620px] border border-border/40 animate-pulse">
        {/* Left pane list skeleton */}
        <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
        
        {/* Right pane details skeleton */}
        <div className="flex-1 flex flex-col gap-6">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="flex-1 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <Card shape="xl" className="w-full bg-white/60 backdrop-blur-md p-4 md:p-6 flex flex-col md:flex-row gap-6 h-auto min-h-[500px] md:h-[620px]">
      {/* Sidebar List (Left) */}
      <div className={`w-full md:w-[300px] lg:w-[340px] shrink-0 flex flex-col h-full ${mobileActivePane === "list" ? "flex" : "hidden md:flex"}`}>
        <TicketList
          tickets={tickets}
          selectedTicketId={selectedTicketId}
          onSelectTicket={handleSelectTicket}
          onCreateTrigger={handleCreateTrigger}
          isCreating={isCreating}
        />
      </div>

      {/* Detail or Form Pane (Right) */}
      <div className={`flex-1 h-full min-w-0 ${mobileActivePane !== "list" ? "flex" : "hidden md:flex"}`}>
        {isCreating ? (
          <div className="w-full overflow-y-auto pr-1 h-full">
            <CreateTicketForm
              onSubmit={handleCreateTicket}
              onCancel={handleCancelCreate}
            />
          </div>
        ) : selectedTicket ? (
          <div className="w-full h-full">
            <TicketDetail
              ticket={selectedTicket}
              onBack={() => setMobileActivePane("list")}
              onUpdateTicket={handleUpdateTicket}
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center bg-bg/20 rounded-[30px] border border-dashed border-border/80">
            <p className="text-text-muted text-sm font-medium">Select a ticket or report a new issue.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

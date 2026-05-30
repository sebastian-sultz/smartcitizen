"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCitizenStore } from "@/store/citizenStore";
import {
  getReport,
  createReport,
  addReportMessage,
  getFAQs,
} from "../api";
import { SupportTicket, FAQItem } from "../types";

import FAQSection from "./FAQSection";
import TicketList from "./TicketList";
import CreateTicketForm from "./CreateTicketForm";
import TicketDetail from "./TicketDetail";

export default function SupportDashboard() {
  const { user, fetchProfile } = useCitizenStore();

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("faq");
  const [viewState, setViewState] = useState<"list" | "create" | "detail">(
    "list"
  );
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );

  const loadSupportData = async () => {
    try {
      setLoading(true);

      // Ensure profile is loaded in store
      await fetchProfile();
      const currentUser = useCitizenStore.getState().user;
      if (!currentUser) return;

      // TODO: Replace localStorage pattern with backend GET /reports?reporter_id=<userId> endpoint when available
      const storageKey = `smartcitizen_reports_${currentUser.id}`;
      const reportIds: string[] =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem(storageKey) || "[]")
          : [];

      // Fetch FAQs and reports in parallel
      const [faqsData, fetchedReports] = await Promise.all([
        getFAQs(),
        Promise.all(
          reportIds.map(async (id) => {
            try {
              const res = await getReport(id);
              return res.report;
            } catch {
              return null;
            }
          })
        ),
      ]);

      setFaqs(faqsData);
      setTickets(fetchedReports.filter(Boolean) as SupportTicket[]);
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
      const currentUser = useCitizenStore.getState().user;
      if (!currentUser) throw new Error("User not loaded");

      // 1. Create the support ticket report
      const reportRes = await createReport({
        reported_user_id: currentUser.id,
        reason: `[${values.category.toUpperCase()}] ${values.subject}: ${values.description}`,
      });
      const report = reportRes.report;

      // 2. Save ID to client-side localStorage
      const storageKey = `smartcitizen_reports_${currentUser.id}`;
      const reportIds: string[] =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem(storageKey) || "[]")
          : [];
      reportIds.push(report.id);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(reportIds));
      }

      // 3. Post first message
      await addReportMessage(report.id, { message: values.description });

      // 4. Fetch updated report details
      const refreshedRes = await getReport(report.id);
      setTickets([refreshedRes.report, ...tickets]);
      setViewState("list");
    } catch (err) {
      console.error("Failed to create ticket:", err);
      throw err;
    }
  };

  const handleUpdateTicket = (updated: SupportTicket) => {
    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
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

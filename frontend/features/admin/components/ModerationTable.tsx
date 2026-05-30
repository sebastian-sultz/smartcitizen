"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { getModerationColumns } from "./ModerationColumns";
import { SupportTicket } from "@/features/citizen/types";
import { getAdminReports, resolveAdminReport } from "../api";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import AdminChatModal from "./AdminChatModal";

export const ModerationTable = () => {
  const [reports, setReports] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatTicket, setSelectedChatTicket] = useState<SupportTicket | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getAdminReports();
      setReports(res);
    } catch (err) {
      console.error("Failed to load reports:", err);
      toast.error("Failed to fetch moderation reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolveReport = async (id: string) => {
    try {
      await resolveAdminReport(id, "Resolved by admin coordinator");
      toast.success("Abuse report marked as resolved.");
      // Refresh list
      const res = await getAdminReports();
      setReports(res);
    } catch (err) {
      console.error("Failed to resolve report:", err);
      toast.error("Failed to resolve report.");
    }
  };

  const handleOpenChat = (ticket: SupportTicket) => {
    setSelectedChatTicket(ticket);
    setChatOpen(true);
  };

  const handleTicketUpdated = (updated: SupportTicket) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedChatTicket(updated);
  };

  const columns = getModerationColumns(handleResolveReport, handleOpenChat);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Abuse & Moderation</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Spinner className="size-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Abuse & Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={columns} 
          data={reports} 
          emptyMessage="No moderation reports found" 
          className="shadow-none border-0" 
        />
      </CardContent>

      <AdminChatModal
        ticket={selectedChatTicket}
        open={chatOpen}
        onOpenChange={setChatOpen}
        onTicketUpdated={handleTicketUpdated}
      />
    </Card>
  );
};

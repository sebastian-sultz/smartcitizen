"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { getModerationColumns } from "./ModerationColumns";
import { SupportTicket } from "@/features/shared/reports";
import { getAdminReports, resolveAdminReport } from "../api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AdminChatModal from "./AdminChatModal";

export const ModerationTable = () => {
  const [reports, setReports] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatTicket, setSelectedChatTicket] = useState<SupportTicket | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const fetchReports = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
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
    fetchReports(false);
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
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
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

      {chatOpen && selectedChatTicket && (
        <AdminChatModal
          ticket={selectedChatTicket}
          open={chatOpen}
          onOpenChange={setChatOpen}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </Card>
  );
};

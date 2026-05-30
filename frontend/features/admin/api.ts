import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { SupportTicket } from "@/features/citizen/types";

export const getAdminReports = async (status?: string): Promise<SupportTicket[]> => {
  try {
    const url = status ? `/admin/reports?status=${status}` : "/admin/reports";
    const response = await api.get<{ reports: SupportTicket[] }>(url);
    return response.data.reports || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to load moderation reports");
  }
};

export const resolveAdminReport = async (
  id: string,
  actionTaken: string
): Promise<SupportTicket> => {
  try {
    const response = await api.put<{ report: SupportTicket }>(`/admin/reports/${id}/resolve`, {
      action_taken: actionTaken,
    });
    return response.data.report;
  } catch (error: unknown) {
    handleApiError(error, "Failed to resolve report");
  }
};

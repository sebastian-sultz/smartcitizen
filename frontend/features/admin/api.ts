import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { SupportTicket } from "@/features/shared/reports";
import { UserResponse } from "@/features/shared/auth/types";

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

export interface PaginationInfo {
  limit: number;
  page: number;
  total_rows: number;
  total_pages: number;
}

export const getNonAdminUsers = async (
  page?: number,
  limit?: number
): Promise<{ users: UserResponse[]; pagination?: PaginationInfo }> => {
  try {
    const response = await api.get<{ users: UserResponse[]; pagination?: PaginationInfo }>("/users", {
      params: { page, limit },
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load users list");
    throw error;
  }
};

export const suspendUser = async (id: string, isSuspended: boolean): Promise<void> => {
  try {
    await api.put(`/users/${id}/suspend`, { is_suspended: isSuspended });
  } catch (error: unknown) {
    handleApiError(error, "Failed to update user suspension status");
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to delete user");
    throw error;
  }
};

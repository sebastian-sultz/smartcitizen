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
  limit?: number,
  search?: string,
  sort?: string
): Promise<{ users: UserResponse[]; pagination?: PaginationInfo }> => {
  try {
    const response = await api.get<{ users: UserResponse[]; pagination?: PaginationInfo }>("/users", {
      params: { page, limit, q: search, sort },
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

import { 
  PaymentAdminResponse, 
  UserNetworkResponse, 
  UserNetworkStats, 
  AdminAnalyticsResponse 
} from "./types";

export const getAdminPaymentHistory = async (
  params: Record<string, any>
): Promise<{ data: PaymentAdminResponse[]; pagination?: PaginationInfo }> => {
  try {
    const response = await api.get<{ data: PaymentAdminResponse[]; pagination?: PaginationInfo }>("/payments/history", {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load payment history");
    throw error;
  }
};

export const downloadPaymentsCSV = async (params: Record<string, any>): Promise<void> => {
  try {
    const response = await api.get("/admin/payments/export", {
      params,
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payments_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error: unknown) {
    handleApiError(error, "Failed to export CSV");
    throw error;
  }
};

export const downloadForm10BDCSV = async (financialYear: string): Promise<void> => {
  try {
    const response = await api.get("/admin/payments/export-10bd", {
      params: { financialYear },
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `form_10bd_${financialYear}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error: unknown) {
    handleApiError(error, "Failed to export Form 10BD CSV");
    throw error;
  }
};

export const getUserNetwork = async (
  id: string,
  recursive: boolean,
  page?: number,
  limit?: number
): Promise<UserNetworkResponse> => {
  try {
    const response = await api.get<UserNetworkResponse>(`/admin/users/${id}/network`, {
      params: { recursive, page, limit },
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load referred user network");
    throw error;
  }
};

export const getUserNetworkStats = async (id: string): Promise<UserNetworkStats> => {
  try {
    const response = await api.get<UserNetworkStats>(`/admin/users/${id}/network-stats`);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load network stats");
    throw error;
  }
};

export const updateVolunteerStatus = async (id: string, status: string): Promise<any> => {
  try {
    const response = await api.put<any>(`/admin/volunteers/${id}/status`, { status });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to update volunteer status");
    throw error;
  }
};

export const getAdminAnalytics = async (): Promise<AdminAnalyticsResponse> => {
  try {
    const response = await api.get<AdminAnalyticsResponse>("/admin/analytics");
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to load operational analytics");
    throw error;
  }
};

export const syncPendingReceipts = async (): Promise<{ count: number }> => {
  try {
    const response = await api.post<{ count: number }>("/admin/payments/sync-receipts");
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to synchronize pending receipts");
    throw error;
  }
};


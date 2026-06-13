import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";

export interface InitiatePaymentRequest {
  amount: number;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  donorPan?: string;
  donorAddress?: string;
}

export const initiatePublicPayment = async (
  payload: InitiatePaymentRequest
): Promise<{ redirectUrl: string; merchantOrderId: string }> => {
  try {
    const response = await api.post<{ redirectUrl: string; merchantOrderId: string }>(
      "/payments/initiate",
      payload
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to initiate payment");
  }
};

import { UserResponse } from "@/features/shared/auth/types";

export interface CreateSupportTicketPayload {
  subject: string;
  description: string;
}

export interface TicketMessage {
  id: string;
  report_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  admin_id?: string | null;
  title: string;
  description: string;
  status: 'Open' | 'Resolved' | 'Closed';
  action_taken?: string | null;
  resolved_at?: string | null;
  created_at: string;
  messages?: TicketMessage[];
  user?: UserResponse;
  admin?: UserResponse;
}

export interface ReportResponse {
  report: SupportTicket;
}

export interface ReportMessagesResponse {
  messages: TicketMessage[];
}

export interface AddMessageResponse {
  data: TicketMessage;
}

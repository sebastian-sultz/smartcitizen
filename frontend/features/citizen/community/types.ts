export interface EventResponse {
  id: string;
  event_name: string;
  event_date: string;
  event_address: string;
  organizer_name: string;
  organizer_phone: string;
  description: string;
  category: string;
  registration_link: string;
  cta_text: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventPayload {
  event_name: string;
  event_date: string;
  event_address: string;
  organizer_name: string;
  organizer_phone: string;
  description: string;
  category?: string;
  registration_link?: string;
  cta_text?: string;
  image?: string;
}

export interface UpdateEventPayload {
  event_name?: string;
  event_date?: string;
  event_address?: string;
  organizer_name?: string;
  organizer_phone?: string;
  description?: string;
  category?: string;
  registration_link?: string;
  cta_text?: string;
  image?: string;
}

import { UserResponse } from "@/features/shared/auth/types";

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  event?: EventResponse;
  user?: UserResponse;
  created_at: string;
  updated_at: string;
}


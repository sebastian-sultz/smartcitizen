export interface EventResponse {
  id: string;
  event_name: string;
  event_date: string;
  event_address: string;
  organizer_name: string;
  organizer_phone: string;
  description: string;
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
  image?: string;
}

export interface UpdateEventPayload {
  event_name?: string;
  event_date?: string;
  event_address?: string;
  organizer_name?: string;
  organizer_phone?: string;
  description?: string;
  image?: string;
}

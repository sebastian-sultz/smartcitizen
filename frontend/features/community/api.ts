import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { EventResponse, CreateEventPayload, UpdateEventPayload } from "./types";

export const getAllEvents = async (): Promise<EventResponse[]> => {
  try {
    const response = await api.get<{ events: EventResponse[] }>('/events');
    const data = response.data;
    return data.events || [];
  } catch (error: any) {
    handleApiError(error, "Failed to fetch events");
  }
};

export const getEventById = async (id: string): Promise<EventResponse> => {
  try {
    const response = await api.get<{ event: EventResponse }>(`/events/${id}`);
    const data = response.data;
    return data.event;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch event details");
  }
};

export const createEvent = async (payload: CreateEventPayload): Promise<EventResponse> => {
  try {
    const response = await api.post<{ event: EventResponse }>('/events', payload);
    const data = response.data;
    return data.event;
  } catch (error: any) {
    handleApiError(error, "Failed to create event");
  }
};

export const updateEvent = async (id: string, payload: UpdateEventPayload): Promise<EventResponse> => {
  try {
    const response = await api.put<{ event: EventResponse }>(`/events/${id}`, payload);
    const data = response.data;
    return data.event;
  } catch (error: any) {
    handleApiError(error, "Failed to update event");
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/events/${id}`);
  } catch (error: any) {
    handleApiError(error, "Failed to delete event");
  }
};

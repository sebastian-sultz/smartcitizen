import api from "@/lib/axios";
import { handleApiError } from "@/lib/api-helpers";
import { EventResponse, CreateEventPayload, UpdateEventPayload, EventRegistration } from "./types";

import { PaginationInfo } from "@/features/admin/api";

export const getAllEvents = async (
  eventType?: string,
  page?: number,
  limit?: number
): Promise<{ events: EventResponse[]; pagination: PaginationInfo }> => {
  try {
    const params: Record<string, any> = {};
    if (eventType) params.event_type = eventType;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await api.get<{ events: EventResponse[]; pagination: PaginationInfo }>('/events', { params });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to fetch events");
    throw error;
  }
};

export const getEventById = async (id: string): Promise<EventResponse> => {
  try {
    const response = await api.get<{ event: EventResponse }>(`/events/${id}`);
    const data = response.data;
    return data.event;
  } catch (error: unknown) {
    handleApiError(error, "Failed to fetch event details");
  }
};

export const createEvent = async (
  payload: CreateEventPayload,
  imageFile?: File | null
): Promise<EventResponse> => {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await api.post<{ event: EventResponse }>('/events', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.event;
  } catch (error: unknown) {
    handleApiError(error, "Failed to create event");
  }
};

export const updateEvent = async (id: string, payload: UpdateEventPayload): Promise<EventResponse> => {
  try {
    const response = await api.put<{ event: EventResponse }>(`/events/${id}`, payload);
    const data = response.data;
    return data.event;
  } catch (error: unknown) {
    handleApiError(error, "Failed to update event");
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/events/${id}`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to delete event");
  }
};

export const registerForEvent = async (id: string): Promise<void> => {
  try {
    await api.post(`/events/${id}/register`);
  } catch (error: unknown) {
    handleApiError(error, "Failed to register for event");
    throw error;
  }
};

export const getUsersByEventId = async (id: string): Promise<EventRegistration[]> => {
  try {
    const response = await api.get<{ registrations: EventRegistration[] }>(`/events/${id}/users`);
    return response.data.registrations || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to fetch event participants");
    throw error;
  }
};

export const getEventsByUserId = async (id: string): Promise<EventRegistration[]> => {
  try {
    const response = await api.get<{ registrations: EventRegistration[] }>(`/users/${id}/events`);
    return response.data.registrations || [];
  } catch (error: unknown) {
    handleApiError(error, "Failed to fetch registered events");
    throw error;
  }
};


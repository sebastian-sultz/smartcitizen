import { create } from "zustand";
import { UserResponse } from "@/features/shared/auth/types";
import { Volunteer } from "@/features/citizen/types";
import { getMemberProfile, getVolunteers } from "@/features/citizen/api";

interface CitizenState {
  user: UserResponse | null;
  volunteer: Volunteer | null;
  loading: boolean;
  hasFetched: boolean;

  fetchProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setVolunteer: (v: Volunteer) => void;
}

export const useCitizenStore = create<CitizenState>((set, get) => ({
  user: null,
  volunteer: null,
  loading: false,
  hasFetched: false,

  fetchProfile: async () => {
    // Skip if already fetched — use refreshProfile() to force re-fetch
    if (get().hasFetched || get().loading) return;

    set({ loading: true });
    try {
      const [profRes, volListRes] = await Promise.all([
        getMemberProfile(),
        getVolunteers(),
      ]);
      const user = profRes.user;
      const volunteers = volListRes?.volunteers || [];
      const volunteer =
        volunteers.find((v) => v.user_id === user.id) || null;

      set({ user, volunteer, hasFetched: true });
    } catch (err) {
      console.error("Failed to fetch citizen profile:", err);
    } finally {
      set({ loading: false });
    }
  },

  refreshProfile: async () => {
    set({ loading: true });
    try {
      const [profRes, volListRes] = await Promise.all([
        getMemberProfile(),
        getVolunteers(),
      ]);
      const user = profRes.user;
      const volunteers = volListRes?.volunteers || [];
      const volunteer =
        volunteers.find((v) => v.user_id === user.id) || null;

      set({ user, volunteer, hasFetched: true });
    } catch (err) {
      console.error("Failed to refresh citizen profile:", err);
    } finally {
      set({ loading: false });
    }
  },

  setVolunteer: (v: Volunteer) => {
    set({ volunteer: v });
  },
}));

// --- Selectors (derived values, not stored in state) ---

export const selectReferralCode = (state: CitizenState): string => {
  if (!state.user) return "";
  return `SC-${state.user.name.split(" ")[0].toUpperCase()}-${state.user.phone.slice(-4)}`;
};

export const selectReferralLink = (state: CitizenState): string => {
  if (!state.user) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://globalsmartcitizensfoundation.org";
  return `${origin}/join_us?ref=${state.user.id}`;
};

export const selectIsVolunteer = (state: CitizenState): boolean => {
  return !!state.volunteer;
};

export const selectVolunteerStatus = (
  state: CitizenState
): "not_applied" | "pending" | "approved" | "rejected" => {
  return state.volunteer ? "approved" : "not_applied";
};

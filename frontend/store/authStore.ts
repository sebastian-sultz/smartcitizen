import { create } from "zustand";
import { logoutUser } from "@/features/shared/auth/api";
import { resetRedirectState } from "@/lib/axios";

export interface Session {
  userId: string;
  userType: string;
}

interface AuthState {
  session: Session | null;
  isLoggedIn: boolean;
  isInitialized: boolean;
  userType: string | null;
  setSession: (session: Session | null) => void;
  logout: (onSuccess?: () => void) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoggedIn: false,
  isInitialized: false,
  userType: null,
  setSession: (session) => {
    resetRedirectState();
    set({
      session,
      isLoggedIn: !!session,
      isInitialized: true,
      userType: session?.userType || null,
    });
  },
  logout: async (onSuccess) => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ session: null, isLoggedIn: false, isInitialized: true, userType: null });
      resetRedirectState();
      if (onSuccess) {
        onSuccess();
      } else if (typeof window !== "undefined") {
        window.location.href = "/member_login";
      }
    }
  },
}));

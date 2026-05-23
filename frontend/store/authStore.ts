import { create } from "zustand";

export interface Session {
  userId: string;
  userType: string;
}

interface AuthState {
  session: Session | null;
  isLoggedIn: boolean;
  userType: string | null;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoggedIn: false,
  userType: null,
  setSession: (session) =>
    set({
      session,
      isLoggedIn: !!session,
      userType: session?.userType || null,
    }),
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ session: null, isLoggedIn: false, userType: null });
      if (typeof window !== "undefined") {
        window.location.href = "/member_login";
      }
    }
  },
}));

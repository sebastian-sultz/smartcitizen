"use client";

import { useEffect, useRef } from "react";
import { useAuthStore, Session } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getProfile, logoutUser } from "@/features/shared/auth/api";
import { resetRedirectState } from "@/lib/axios";

export function AuthInitializer({ session }: { session: Session | null }) {
  const router = useRouter();
  const initialized = useRef(false);

  if (!initialized.current) {
    useAuthStore.setState({
      session,
      isLoggedIn: !!session,
      isInitialized: !!session,
      userType: session?.userType || null,
    });
    initialized.current = true;
  }

  useEffect(() => {
    const checkSession = async () => {
      const state = useAuthStore.getState();
      if (!state.isLoggedIn && !state.isInitialized) {
        try {
          const user = await getProfile();
          useAuthStore.setState({
            session: { userId: user.id, userType: user.user_type },
            isLoggedIn: true,
            isInitialized: true,
            userType: user.user_type,
          });
        } catch (err) {
          useAuthStore.setState({
            session: null,
            isLoggedIn: false,
            isInitialized: true,
            userType: null,
          });
        }
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const handleSessionExpired = async (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      const path = customEvent.detail?.path || "";

      toast.error("Session expired. Redirecting to login...");

      try {
        await logoutUser();
      } catch (err) {
        console.error("Failed to clean up session cookie:", err);
      } finally {
        useAuthStore.setState({ session: null, isLoggedIn: false, userType: null });
        resetRedirectState();
        if (path.startsWith("/admin")) {
          router.push("/admin/login");
        } else {
          router.push("/member_login");
        }
      }
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, [router]);

  return null;
}

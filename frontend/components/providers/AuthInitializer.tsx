"use client";

import { useRef } from "react";
import { useAuthStore, Session } from "@/store/authStore";

export function AuthInitializer({ session }: { session: Session | null }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useAuthStore.setState({
      session,
      isLoggedIn: !!session,
      userType: session?.userType || null,
    });
    initialized.current = true;
  }
  return null;
}

import axios from "axios";
import { toast } from "sonner";
import { resetRedirectState } from "@/lib/axios";

export function handleApiError(error: unknown, fallbackMessage: string): never {
  let message = fallbackMessage;
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as { error?: string; message?: string } | undefined;
    message = responseData?.error || responseData?.message || fallbackMessage;
  }
  toast.error(message);
  throw error;
}

export async function performLogout(
  redirectTo: "/member_login" | "/admin/login" = "/member_login",
) {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout cleanup endpoint failed:", err);
  } finally {
    resetRedirectState();
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  }
}

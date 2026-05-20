import { toast } from "sonner";

export function handleApiError(error: any, fallbackMessage: string): never {
  const message = error.response?.data?.error || fallbackMessage;
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
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  }
}

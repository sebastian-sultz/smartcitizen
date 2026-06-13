import axios from "axios";
import { toast } from "sonner";

// Flag to prevent toast spamming and multiple redirect actions for concurrent 401 requests
let isRedirecting = false;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const resetRedirectState = () => {
  isRedirecting = false;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  timeout: 10000, // 10-second timeout to handle hanging requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for pre-request configurations
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for unified security checks and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isTimeout = error.code === "ECONNABORTED";
    const isNetworkError = error.message === "Network Error";

    const skipAuthRedirect =
      originalRequest && (originalRequest as any).skipAuthRedirect;
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !skipAuthRedirect
    ) {
      // Don't refresh token for auth routes
      const isAuthRoute =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/forget-password");

      if (!isAuthRoute) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          api
            .post("/auth/refresh")
            .then(() => {
              processQueue(null);
              resolve(api(originalRequest));
            })
            .catch((err) => {
              processQueue(err);

              if (typeof window !== "undefined" && !isRedirecting) {
                isRedirecting = true;
                window.dispatchEvent(
                  new CustomEvent("auth-session-expired", {
                    detail: { path: window.location.pathname },
                  }),
                );
              }
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
    }

    if (typeof window !== "undefined") {
      const path = window.location.pathname;

      // Handle 401 Unauthorized (fallback if refresh failed or was an auth route)
      if (status === 401 && !skipAuthRedirect) {
        if (
          !path.includes("/member_login") &&
          !path.includes("/admin/login") &&
          !isRedirecting
        ) {
          isRedirecting = true;
          window.dispatchEvent(
            new CustomEvent("auth-session-expired", {
              detail: { path },
            }),
          );
        }
      } else if (isTimeout) {
        toast.error("Request timed out. Please try again.");
      } else if (isNetworkError) {
        toast.error(
          "Unable to connect to the server. Please check your connection.",
        );
      } else if (status >= 400) {
        const skipGlobalErrorToast = (
          error.config as { skipGlobalErrorToast?: boolean }
        )?.skipGlobalErrorToast;
        if (!skipGlobalErrorToast) {
          const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "An unexpected error occurred.";
          toast.error(message);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;

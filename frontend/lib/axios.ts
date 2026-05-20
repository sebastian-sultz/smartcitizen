import axios from 'axios';
import { toast } from 'sonner';

// Flag to prevent toast spamming and multiple redirect actions for concurrent 401 requests
let isRedirecting = false;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api',
  withCredentials: true,
  timeout: 10000, // 10-second timeout to handle hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for pre-request configurations
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unified security checks and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED';
    const isNetworkError = error.message === 'Network Error';

    if (typeof window !== 'undefined') {
      const path = window.location.pathname;

      // Handle 401 Unauthorized
      if (status === 401) {
        // Prevent redirection loops and duplicate toast popups
        if (!path.includes('/member_login') && !path.includes('/admin/login') && !isRedirecting) {
          isRedirecting = true;
          toast.error('Session expired. Redirecting to login...');
          
          try {
            // Clear cookies securely using Next.js backend API handler
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (logoutErr) {
            console.error('Failed to log out cookie via route handler:', logoutErr);
          }

          // Auto-redirect to correct dashboard login context
          if (path.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/member_login';
          }
        }
      } 
      // Handle Network Timeout Edge Case
      else if (isTimeout) {
        toast.error('Request timed out. Please try again.');
      }
      // Handle Server Offline / CORS Network Errors
      else if (isNetworkError) {
        toast.error('Unable to connect to the server. Please check your connection.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;

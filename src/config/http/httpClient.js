import axios from 'axios';
import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from '../store/authStore';

const httpClient = axios.create({
  baseURL:  `${process.env.REACT_APP_API_BASE_URL}/api`,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});



httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Handle 401 Unauthorized with Token Refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid refresh on auth endpoints
      const isAuthEndpoint = 
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh-token') ||
        originalRequest.url?.includes('/auth/verify-otp') ||
        originalRequest.url?.includes('/auth/forgot-password');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // Check if we have a refresh token
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      // Mark this request as retried
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      // Start token refresh
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${httpClient.defaults.baseURL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        
        // Update cookies (refresh token might be rotated by backend)
        setAuthCookies(newAccessToken, refreshToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry the original request
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 🔥 Handle 403 Forbidden (Account Deactivated)
    if (error.response?.status === 403) {
      const message = error.response?.data?.message || '';
      if (message.toLowerCase().includes('deactivated')) {
        handleLogout('Your account has been deactivated. Please contact support.');
      }
    }

    // 🔥 Handle 429 Rate Limit
    if (error.response?.status === 429) {
      console.error('⚠️ Rate limit exceeded:', error.response?.data?.message);
    }

    // 🔥 Handle Network Errors
    if (!error.response) {
      console.error('❌ Network error:', error.message);
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

/* =========================
   LOGOUT HELPER
========================= */
const handleLogout = (message) => {
  // Import dynamically to avoid circular dependency
  import('../../config/store/authStore').then(({ useAuthStore }) => {
    clearAuthCookies();
    useAuthStore.getState().logout();
    
    // Redirect to login if not already there
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/auth/login')) {
      const redirectUrl = message 
        ? `/auth/login?message=${encodeURIComponent(message)}`
        : '/auth/login';
      window.location.href = redirectUrl;
    }
  });
};


export default httpClient;
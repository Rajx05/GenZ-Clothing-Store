import axios from "axios";

// Base axios instance for API calls
const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true, // sends refresh cookie
});

// Mutable auth state - updated via setAuthState from React context
// This allows interceptors to read the CURRENT token at request time,
// not the stale closure value captured when the callback was created
let authState = {
  accessToken: null,
  setAuth: null,
};

// Token refresh state management
let isRefreshing = false;
let failedQueue = [];

/**
 * Update the auth state from React context
 * Called from AuthContext's useEffect whenever auth.accessToken changes
 */
export const setAuthState = (accessToken, setAuth) => {
  authState.accessToken = accessToken;
  authState.setAuth = setAuth;
};

/**
 * Process the failed request queue after token refresh
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - attaches Bearer token to requests
axiosPrivate.interceptors.request.use(
  (config) => {
    // Don't add Authorization header if already set
    if (!config.headers.Authorization && authState.accessToken) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handles 401 errors with automatic token refresh
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if not a 401 error or request already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If token refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosPrivate(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint using base axios (without interceptors to avoid infinite loop)
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "/api"}/auth/get-new-access-token`,
        {},
        { withCredentials: true },
      );

      const newAccessToken = response.data.accessToken;

      // Update auth state in React context
      if (authState.setAuth) {
        authState.setAuth((prev) => ({
          ...prev,
          accessToken: newAccessToken,
          user: response.data.user,
        }));
      }

      // Update the mutable auth state
      authState.accessToken = newAccessToken;

      // Process queued requests with new token
      processQueue(null, newAccessToken);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosPrivate(originalRequest);
    } catch (refreshError) {
      // Token refresh failed - clear auth state and reject all queued requests
      processQueue(refreshError, null);

      // Clear auth state
      authState.accessToken = null;

      // Optionally redirect to login or show error
      console.error("Token refresh failed:", refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosPrivate;

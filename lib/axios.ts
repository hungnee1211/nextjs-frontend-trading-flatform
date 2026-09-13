import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Axios instance cho API calls
 * - baseURL: URL của backend API
 * - withCredentials: true để gửi httpOnly cookies
 * - timeout: 10s default
 */
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - có thể thêm logging, auth headers, etc.
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý error chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      // Có thể trigger logout hoặc redirect
      console.warn('[API] Unauthorized - token may have expired');
    }
    return Promise.reject(error);
  }
);

export default api;
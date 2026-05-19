import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// ─── Base URL ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30_000, // 30 s — generous for large PDF uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log every outgoing request in development
    if (import.meta.env.DEV) {
      console.info(`📤 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [Request Setup Error]', error.message);
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.info(
        `✅ [API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
      );
    }
    return response;
  },
  (error: AxiosError<{ error?: string; message?: string }>) => {
    // ── Derive a human-readable message ─────────────────────────────────
    let userMessage = 'Something went wrong. Please try again.';

    if (!error.response) {
      // Network error / timeout / CORS
      if (error.code === 'ECONNABORTED') {
        userMessage = 'Request timed out. The server took too long to respond.';
      } else if (error.code === 'ERR_NETWORK') {
        userMessage = 'Network error. Please check your internet connection.';
      } else {
        userMessage = 'Cannot reach the server. Please try again later.';
      }
    } else {
      const { status, data } = error.response;
      const serverMessage = data?.error ?? data?.message;

      switch (status) {
        case 400:
          userMessage = serverMessage ?? 'Invalid request. Please check your input.';
          break;
        case 401:
          userMessage = serverMessage ?? 'Unauthorized. Please log in.';
          break;
        case 403:
          userMessage = serverMessage ?? 'You do not have permission to perform this action.';
          break;
        case 404:
          userMessage = serverMessage ?? 'The requested resource was not found.';
          break;
        case 413:
          userMessage = serverMessage ?? 'File is too large to upload.';
          break;
        case 415:
          userMessage = serverMessage ?? 'Unsupported file type. Only PDFs are allowed.';
          break;
        case 422:
          userMessage = serverMessage ?? 'Unprocessable request. Please verify your data.';
          break;
        case 429:
          userMessage = serverMessage ?? 'Too many requests. Please slow down.';
          break;
        case 500:
          userMessage = serverMessage ?? 'Internal server error. Please try again later.';
          break;
        case 503:
          userMessage = serverMessage ?? 'Service unavailable. Please try again later.';
          break;
        default:
          userMessage = serverMessage ?? `Unexpected error (${status}).`;
      }
    }

    console.error(
      `❌ [API Error] ${error.response?.status ?? error.code} — ${userMessage}`
    );

    // Attach the resolved message so components can use it directly
    // without needing to re-parse the error themselves.
    (error as AxiosError & { userMessage: string }).userMessage = userMessage;

    return Promise.reject(error);
  }
);

export default axiosInstance;

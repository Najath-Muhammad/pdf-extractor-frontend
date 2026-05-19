import axios, { type AxiosError } from 'axios';

/**
 * Extracts a user-friendly error message from any thrown value.
 *
 * Priority:
 *  1. `.userMessage` injected by the Axios response interceptor
 *  2. `.response.data.error` or `.response.data.message` from the server
 *  3. The provided `fallback` string
 */
export function parseApiError(
  err: unknown,
  fallback = 'An unexpected error occurred.'
): string {
  if (!axios.isAxiosError(err)) return fallback;

  const axiosErr = err as AxiosError<{ error?: string; message?: string }> & {
    userMessage?: string;
  };

  // Interceptor already resolved a readable message — use it directly.
  if (axiosErr.userMessage) return axiosErr.userMessage;

  // Fallback: read directly from the response body.
  const data = axiosErr.response?.data;
  return data?.error ?? data?.message ?? fallback;
}

/**
 * Shared HTTP client for communication with the backend API.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface ApiError {
  detail: string;
}

/**
 * Execute a typed API request and automatically include bearer token if present.
 */
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(error.detail || "API Error");
  }

  return response.json();
}

export { apiCall };

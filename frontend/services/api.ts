/**
 * Shared HTTP client for communication with the backend API.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const AUTH_TOKEN_KEY = "auth_token";

interface ApiError {
  detail: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: AuthUser;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string;
}

/**
 * Execute a typed API request and automatically include bearer token if present.
 */
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

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
    let message = "API Error";

    try {
      const error = (await response.json()) as ApiError;
      message = error.detail || message;
    } catch {
      // Ignore parsing errors and use fallback message.
    }

    throw new Error(message);
  }

  return response.json();
}

const authAPI = {
  login(payload: LoginPayload) {
    return apiCall<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload: RegisterPayload) {
    return apiCall<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

const usersAPI = {
  getMe() {
    return apiCall<AuthUser>("/users/me");
  },
};

export { apiCall, authAPI, usersAPI, AUTH_TOKEN_KEY };

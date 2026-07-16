const BASE_URL = "http://localhost:5001/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearToken(): void {
  localStorage.removeItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  return json.data;
}

export function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint);
}

export function post<T>(endpoint: string, body: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function patch<T>(endpoint: string, body: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

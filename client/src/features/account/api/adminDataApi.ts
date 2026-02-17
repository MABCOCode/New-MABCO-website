const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";
const API_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status?: number;
  path: string;

  constructor(message: string, path: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.path = path;
    this.status = status;
  }
}

function getErrorMessage(path: string, status?: number) {
  if (status === 401 || status === 403) {
    return `Access denied for ${path}. Check admin API key and permissions.`;
  }
  if (status && status >= 500) {
    return `Server error (${status}) while loading ${path}.`;
  }
  if (status) {
    return `Request failed (${status}) for ${path}.`;
  }
  return `Network error while loading ${path}.`;
}

async function getJson<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (ADMIN_API_KEY) {
    headers["x-admin-key"] = ADMIN_API_KEY;
  }

  let timeoutId: number | undefined;
  const controller = new AbortController();

  try {
    timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, { headers, signal: controller.signal });
    if (!res.ok) {
      throw new ApiError(getErrorMessage(path, res.status), path, res.status);
    }

    const json = await res.json();
    return (json?.data ?? []) as T;
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new ApiError(`Request timed out for ${path}.`, path);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(getErrorMessage(path), path);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
}

export const fetchAdminUsers = () => getJson<any[]>("/admin/users");
export const fetchAdminOrders = () => getJson<any[]>("/admin/orders");
export const fetchAdminActions = () => getJson<any[]>("/admin/actions");
export const fetchAdminNotifications = () => getJson<any[]>("/admin/notifications");
export const fetchVisitorSessions = () => getJson<any[]>("/admin/analytics/visitor-sessions");
export const fetchCartEvents = () => getJson<any[]>("/admin/analytics/cart-events");

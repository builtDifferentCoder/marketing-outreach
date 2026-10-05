import { Prospect, ProspectFormData, StatsData } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let errorMessage = `API Error: ${res.statusText} (${res.status})`;
      try {
        const data = await res.json();
        if (data.detail) {
          errorMessage = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
        }
      } catch {
        // Fallback to text
      }
      throw new ApiError(errorMessage, res.status);
    }

    if (res.status === 204) {
      return null as T;
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Failed to connect to CRM API server";
    throw new Error(
      `${message}. Please verify the FastAPI backend is running on ${API_BASE_URL}`
    );
  }
}

export const api = {
  getStats: () => request<StatsData>("/api/stats"),

  getDueFollowUps: () => request<Prospect[]>("/api/follow-ups/due"),

  getUpcomingFollowUps: () => request<Prospect[]>("/api/follow-ups/upcoming"),

  getProspects: (params?: {
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.priority && params.priority !== "ALL") query.set("priority", params.priority);
    if (params?.sort) query.set("sort", params.sort);

    const qs = query.toString();
    return request<Prospect[]>(`/api/prospects${qs ? `?${qs}` : ""}`);
  },

  getProspect: (id: number) => request<Prospect>(`/api/prospects/${id}`),

  createProspect: (data: ProspectFormData) =>
    request<Prospect>("/api/prospects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProspect: (id: number, data: Partial<ProspectFormData>) =>
    request<Prospect>(`/api/prospects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProspect: (id: number) =>
    request<void>(`/api/prospects/${id}`, {
      method: "DELETE",
    }),

  updateStatus: (id: number, status: string) =>
    request<Prospect>(`/api/prospects/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  updateFollowUp: (id: number, nextFollowUpDate: string | null) =>
    request<Prospect>(`/api/prospects/${id}/follow-up`, {
      method: "PATCH",
      body: JSON.stringify({ next_follow_up_date: nextFollowUpDate }),
    }),

  seedData: (force: boolean = false) =>
    request<{ message: string }>(`/api/seed?force=${force}`, {
      method: "POST",
    }),
};

import type { ApiResult, ProblemDetails } from "@/types/http";
import { fetchWithAuth } from "./fetchWithAuth";

async function handleResponse<T>(res: Response): Promise<ApiResult<T>> {
  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const problem: ProblemDetails = contentType?.includes(
      "application/problem+json",
    )
      ? await res.json()
      : { title: `HTTP ${res.status}`, status: res.status };

    return { ok: false, problem, status: res.status };
  }

  const data = contentType?.includes("application/json")
    ? await res.json()
    : undefined;

  return { ok: true, data, headers: res.headers };
}

export const apiClient = {
  async get<T>(url: string): Promise<ApiResult<T>> {
    const res = await fetchWithAuth(url, { method: "GET" });
    return handleResponse<T>(res);
  },

  async post<T, B>(url: string, body: B): Promise<ApiResult<T>> {
    const res = await fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  async put<T, B>(url: string, body: B): Promise<ApiResult<T>> {
    const res = await fetchWithAuth(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  async delete<T>(url: string): Promise<ApiResult<T>> {
    const res = await fetchWithAuth(url, { method: "DELETE" });
    return handleResponse<T>(res);
  },
};

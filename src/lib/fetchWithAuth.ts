import { cookies } from "next/headers";
import { cookieForwarder } from "@/lib/forwardCookiesToBrowser";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

async function makeInit(init: RequestInit = {}): Promise<RequestInit> {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
      Cookie: cookieHeader,
    },
  };
}

async function tryRefresh(): Promise<Response> {
  const init = await makeInit({
    method: "POST",
  });
  const refreshRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, init);

  if (!refreshRes.ok) return refreshRes;

  await cookieForwarder.forwardCookiesToBrowser(refreshRes.headers);

  return refreshRes;
}

export async function fetchWithAuth(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  // 1. Build init including cookies from browser → server
  const requestInit = await makeInit(init);

  // 2. Call API
  let res = await fetch(`${API_BASE}${url}`, requestInit);

  // 3. If expired → try refresh
  if (res.status === 401) {
    const refreshedResponse = await tryRefresh();

    if (refreshedResponse.ok) {
      // retry the original request
      const cookieHeader = refreshedResponse.headers
        .getSetCookie()
        ?.map((c) => c.split(";")[0]) // name=value
        .join("; ");

      const refreshedInit: RequestInit = {
        ...init,
        headers: {
          Accept: "application/json",
          ...init?.headers,
          Cookie: cookieHeader,
        },
      };
      res = await fetch(`${API_BASE}${url}`, refreshedInit);
    }
  }
  return res;
}

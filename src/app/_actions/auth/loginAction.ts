"use server";

import { redirect } from "next/navigation";
import type { LoginRequest } from "@/services/authService";
import { login } from "@/services/authService";
import { cookieForwarder } from "@/lib/forwardCookiesToBrowser";

type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = (formData.get("email") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const body: LoginRequest = { email, password };

  const result = await login(body);

  if (!result.ok) {
    const title =
      result.problem.title ?? "Invalid credentials. Please try again.";
    const detail = result.problem.detail ?? "";
    return { error: `${title}${detail ? `: ${detail}` : ""}` };
  }

  await cookieForwarder.forwardCookiesToBrowser(result.headers);

  redirect("/warehouses");
}

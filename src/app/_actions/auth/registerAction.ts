"use server";

import { redirect } from "next/navigation";
import type { RegisterCommand } from "@/services/authService";
import { register } from "@/services/authService";

type RegisterState = {
  error?: string;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = (formData.get("email") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const confirmPassword =
    (formData.get("confirmPassword") as string | null) ?? "";

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const body: RegisterCommand = { email, password };

  const result = await register(body);

  if (!result.ok) {
    const title = result.problem.title ?? "Registration failed";
    const detail = result.problem.detail ?? "";
    return { error: `${title}${detail ? `: ${detail}` : ""}` };
  }

  redirect("/login?registered=1");
}

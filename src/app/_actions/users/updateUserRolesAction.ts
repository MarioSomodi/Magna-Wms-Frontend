"use server";

import { updateUserRoles } from "@/services/userService";
import { revalidatePath } from "next/cache";
import type { ServerActionResult } from "@/types/http";
import { redirect } from "next/navigation";

export async function updateUserRolesAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const id = Number(formData.get("id"));
  const rolesRaw = formData.get("roleIds") as string | null;

  if (!id || !rolesRaw) {
    return { ok: false, error: "Invalid form data." };
  }

  const roleIds = JSON.parse(rolesRaw) as number[];

  const result = await updateUserRoles(id, { roleIds });

  if (!result.ok) return { problem: result.problem };

  revalidatePath(`/users`);
  revalidatePath(`/users/${id}`);
  revalidatePath(`/users/${id}/roles`);

  redirect(`/users/${id}`);
}

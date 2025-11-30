"use server";

import { updateUserActiveStatus, type UpdateUserActiveStatusRequest } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/types/http";

export async function toggleUserActiveAction(
  _prevState: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const idRaw = formData.get("id");
  const activeRaw = formData.get("active");

  const id = Number(idRaw);
  const active = activeRaw === "true";

  if (!id || Number.isNaN(id)) {
    return { ok: false, error: "Invalid user ID." };
  }

  const body: UpdateUserActiveStatusRequest = {
    isActive: !active,
  };

  const result = await updateUserActiveStatus(id, body);

  if (!result.ok) {
    return { problem: result.problem };
  }

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  return { ok: true };
}

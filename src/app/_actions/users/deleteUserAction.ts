"use server";

import { deleteUser } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { ServerActionResult } from "@/types/http";

export async function deleteUserAction(
  _prevState: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const idRaw = formData.get("id");
  const id = Number(idRaw);

  if (!id || Number.isNaN(id)) {
    return { ok: false, error: "Invalid user ID." };
  }

  const result = await deleteUser(id);

  if (!result.ok) {
    return { problem: result.problem };
  }

  revalidatePath("/users");
  return { ok: true };
}

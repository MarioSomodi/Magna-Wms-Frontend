"use server";

import { revalidatePath } from "next/cache";
import { deleteRole } from "@/services/roleService";
import type { ServerActionResult } from "@/types/http";

export async function deleteRoleAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const idRaw = formData.get("id");
  const id = Number(idRaw);

  if (!id || Number.isNaN(id)) {
    return { ok: false, error: "Invalid role ID." };
  }

  const result = await deleteRole(id);

  if (!result.ok) {
    return { problem: result.problem };
  }

  revalidatePath("/roles");

  return { ok: true };
}

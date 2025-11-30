"use server";

import { revalidatePath } from "next/cache";
import { updateRolePermissions } from "@/services/roleService";
import type { ServerActionResult } from "@/types/http";
import { redirect } from "next/navigation";

export async function updateRolePermissionsAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const idRaw = formData.get("id");
  const permissionsRaw = formData.get("permissionKeys") as string | null;

  const id = Number(idRaw);

  if (!id || Number.isNaN(id) || permissionsRaw == null) {
    return { ok: false, error: "Invalid form data." };
  }

  let permissionKeys: string[];

  try {
    permissionKeys = JSON.parse(permissionsRaw) as string[];
  } catch {
    return { ok: false, error: "Invalid permissions payload." };
  }

  const result = await updateRolePermissions(id, { permissionKeys });

  if (!result.ok) {
    return { problem: result.problem };
  }

  revalidatePath("/roles");
  revalidatePath(`/roles/${id}`);

  redirect(`/roles/${id}`);
}

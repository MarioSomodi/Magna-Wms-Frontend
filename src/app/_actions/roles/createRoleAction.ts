"use server";

import { revalidatePath } from "next/cache";
import { createRole, type CreateRoleRequest } from "@/services/roleService";
import type { ServerActionResult } from "@/types/http";

export async function createRoleAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const nameRaw = formData.get("name");
  const descriptionRaw = formData.get("description");

  const name = (nameRaw as string | null)?.trim() ?? "";
  const description = (descriptionRaw as string | null)?.trim() ?? "";

  if (!name) {
    return { ok: false, error: "Role name is required." };
  }

  const body: CreateRoleRequest = {
    name,
    description: description || null,
    permissionKeys: ["Warehouses.Read"],
  };

  const result = await createRole(body);

  if (!result.ok) {
    return { problem: result.problem };
  }

  revalidatePath("/roles");
  return { ok: true };
}

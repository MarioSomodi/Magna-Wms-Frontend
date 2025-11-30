"use server";

import { updateUserWarehouses } from "@/services/userService";
import type { ServerActionResult } from "@/types/http";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserWarehousesAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const id = Number(formData.get("id"));
  const json = formData.get("warehouseIds") as string | null;

  if (!id || !json) {
    return { ok: false, error: "Invalid form data" };
  }

  const warehouseIds = JSON.parse(json) as number[];

  const result = await updateUserWarehouses(id, { warehouseIds });

  if (!result.ok) return { problem: result.problem };

  revalidatePath(`/users/${id}`);
  revalidatePath(`/users/${id}/warehouses`);
  revalidatePath("/users");

  redirect(`/users/${id}`);
}

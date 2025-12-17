"use server";

import { ServerActionResult } from "@/types/http";
import { updateWarehouse } from "@/services/warehouseService";
import { revalidatePath } from "next/cache";

export async function updateWarehouseAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const id = Number(formData.get("id"));

  const payload = {
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    timeZone: formData.get("timeZone") as string,
  };

  const result = await updateWarehouse(id, payload);

  if (!result.ok) return { problem: result.problem };

  revalidatePath("/warehouses");
  return { ok: true };
}

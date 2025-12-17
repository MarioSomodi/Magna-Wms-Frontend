"use server";

import { ServerActionResult } from "@/types/http";
import { deactivateWarehouse } from "@/services/warehouseService";
import { revalidatePath } from "next/cache";

export async function deactivateWarehouseAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const id = Number(formData.get("id"));

  const result = await deactivateWarehouse(id);
  if (!result.ok) return { problem: result.problem };

  revalidatePath("/warehouses");
  return { ok: true };
}

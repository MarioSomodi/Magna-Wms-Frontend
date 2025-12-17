"use server";

import { ServerActionResult } from "@/types/http";
import { createWarehouse } from "@/services/warehouseService";
import { revalidatePath } from "next/cache";

export async function createWarehouseAction(
  _prev: ServerActionResult,
  formData: FormData,
): Promise<ServerActionResult> {
  const payload = {
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    timeZone: formData.get("timeZone") as string,
  };

  const result = await createWarehouse(payload);

  if (!result.ok) return { problem: result.problem };

  revalidatePath("/warehouses");
  return { ok: true };
}

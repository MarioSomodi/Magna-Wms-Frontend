import { apiClient } from "@/lib/apiClient";
import type { ApiResult } from "@/types/http";
import type { components } from "@/types/api";

export type InventoryDto = components["schemas"]["InventoryDto"];
export type InventoryLedgerEntryDto =
  components["schemas"]["InventoryLedgerEntryDto"];

export async function getInventory(
  warehouseId?: number,
): Promise<ApiResult<InventoryDto[]>> {
  const query = warehouseId ? `?warehouseId=${warehouseId}` : "";
  return apiClient.get<InventoryDto[]>(`/api/v1/inventory/${query}`);
}

export async function getInventoryLedger(
  warehouseId: number,
  itemId: number,
  locationId?: number,
): Promise<ApiResult<InventoryLedgerEntryDto[]>> {
  const query = locationId ? `?locationId=${locationId}` : "";
  return apiClient.get<InventoryLedgerEntryDto[]>(
    `/api/v1/Inventory/${warehouseId}/items/${itemId}/ledger${query}`,
  );
}

import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";
import type { ApiResult } from "@/types/http";

export type WarehouseDto = components["schemas"]["WarehouseDto"];

export async function getWarehouses(): Promise<ApiResult<WarehouseDto[]>> {
  return apiClient.get<WarehouseDto[]>("/api/v1/Warehouse");
}

export async function getWarehouseById(
  id: number,
): Promise<ApiResult<WarehouseDto>> {
  return apiClient.get<WarehouseDto>(`/api/v1/Warehouse/${id}`);
}

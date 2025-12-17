import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";
import type { ApiResult } from "@/types/http";

export type WarehouseDto = components["schemas"]["WarehouseDto"];
export type CreateWarehouseRequest =
  components["schemas"]["CreateWarehouseRequest"];
export type UpdateWarehouseRequest =
  components["schemas"]["UpdateWarehouseRequest"];

export async function getWarehouses(): Promise<ApiResult<WarehouseDto[]>> {
  return apiClient.get<WarehouseDto[]>("/api/v1/Warehouse");
}

export async function getWarehouseById(
  id: number,
): Promise<ApiResult<WarehouseDto>> {
  return apiClient.get<WarehouseDto>(`/api/v1/Warehouse/${id}`);
}

export async function createWarehouse(
  body: CreateWarehouseRequest,
): Promise<ApiResult<WarehouseDto>> {
  return apiClient.post<WarehouseDto, CreateWarehouseRequest>(
    "/api/v1/Warehouse",
    body,
  );
}

export async function updateWarehouse(
  id: number,
  body: UpdateWarehouseRequest,
): Promise<ApiResult<WarehouseDto>> {
  return apiClient.put<WarehouseDto, UpdateWarehouseRequest>(
    `/api/v1/Warehouse/${id}`,
    body,
  );
}

export async function activateWarehouse(
  id: number,
): Promise<ApiResult<WarehouseDto>> {
  return apiClient.get<WarehouseDto>(`/api/v1/Warehouse/${id}/activate`);
}

export async function deactivateWarehouse(
  id: number,
): Promise<ApiResult<WarehouseDto>> {
  return apiClient.get<WarehouseDto>(`/api/v1/Warehouse/${id}/deactivate`);
}

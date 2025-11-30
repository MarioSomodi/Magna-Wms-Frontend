import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";
import type { ApiResult } from "@/types/http";
import { Success } from "@/services/userService";

export type SalesOrderDto = components["schemas"]["SalesOrderDto"];
export type SalesOrderLineDto = components["schemas"]["SalesOrderLineDto"];

export type CreateSalesOrderRequest =
  components["schemas"]["CreateSalesOrderRequest"];

export type CreateSalesOrderLineRequest =
  components["schemas"]["CreateSalesOrderLineRequest"];

export async function getSalesOrdersByWarehouse(
  warehouseId: number,
): Promise<ApiResult<SalesOrderDto[]>> {
  return apiClient.get<SalesOrderDto[]>(
    `/api/v1/SalesOrder/warehouse/${warehouseId}`,
  );
}

export async function getSalesOrder(
  id: number,
): Promise<ApiResult<SalesOrderDto>> {
  return apiClient.get<SalesOrderDto>(`/api/v1/SalesOrder/${id}`);
}

export async function createSalesOrder(
  body: CreateSalesOrderRequest,
): Promise<ApiResult<SalesOrderDto>> {
  return apiClient.post<SalesOrderDto, CreateSalesOrderRequest>(
    "/api/v1/SalesOrder",
    body,
  );
}

export async function allocateSalesOrder(
  id: number,
): Promise<ApiResult<SalesOrderDto>> {
  return apiClient.get<SalesOrderDto>(`/api/v1/SalesOrder/${id}/allocate`);
}

export async function cancelSalesOrder(
  id: number,
): Promise<ApiResult<Success>> {
  return apiClient.get<Success>(`/api/v1/SalesOrder/${id}/cancel`);
}

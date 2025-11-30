import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";
import type { ApiResult } from "@/types/http";

export type ReceiptDto = components["schemas"]["ReceiptDto"];
export type ReceiptLineDto = components["schemas"]["ReceiptLineDto"];
export type CreateReceiptRequest =
  components["schemas"]["CreateReceiptRequest"];
export type CreateReceiptLineRequest =
  components["schemas"]["CreateReceiptLineRequest"];
export type ReceiveReceiptLineRequest =
  components["schemas"]["ReceiveReceiptLineRequest"];

export async function getReceiptsByWarehouse(
  warehouseId: number,
): Promise<ApiResult<ReceiptDto[]>> {
  return apiClient.get<ReceiptDto[]>(
    `/api/v1/Receipt/warehouse/${warehouseId}`,
  );
}

export async function getReceiptLines(
  id: number,
): Promise<ApiResult<ReceiptLineDto[]>> {
  return apiClient.get<ReceiptLineDto[]>(`/api/v1/Receipt/${id}/lines`);
}

export async function getReceipt(id: number): Promise<ApiResult<ReceiptDto>> {
  return apiClient.get<ReceiptDto>(`/api/v1/Receipt/${id}`);
}

export async function createReceipt(
  body: CreateReceiptRequest,
): Promise<ApiResult<ReceiptDto>> {
  return apiClient.post<ReceiptDto, CreateReceiptRequest>(
    "/api/v1/Receipt",
    body,
  );
}

export async function receiveReceiptLine(
  id: number,
  lineId: number,
  body: ReceiveReceiptLineRequest,
): Promise<ApiResult<ReceiptDto>> {
  return apiClient.post<ReceiptDto, ReceiveReceiptLineRequest>(
    `/api/v1/Receipt/${id}/lines/${lineId}/receive`,
    body,
  );
}

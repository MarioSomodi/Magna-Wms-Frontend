import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";
import type { ApiResult } from "@/types/http";

export type UserDto = components["schemas"]["UserDto"];
export type Success = components["schemas"]["Success"];

export type UpdateUserRolesRequest =
  components["schemas"]["UpdateUserRolesRequest"];
export type UpdateUserWarehousesRequest =
  components["schemas"]["UpdateUserWarehousesRequest"];
export type UpdateUserActiveStatusRequest =
  components["schemas"]["UpdateUserActiveStatusRequest"];

export async function getUsers(): Promise<ApiResult<UserDto[]>> {
  return apiClient.get<UserDto[]>("/api/v1/User");
}

export async function deleteUser(id: number): Promise<ApiResult<Success[]>> {
  return apiClient.delete<Success[]>(`/api/v1/User/${id}`);
}

export async function getUserById(id: number): Promise<ApiResult<UserDto>> {
  return apiClient.get<UserDto>(`/api/v1/User/${id}`);
}

export async function updateUserRoles(
  id: number,
  body: UpdateUserRolesRequest,
): Promise<ApiResult<UserDto>> {
  return apiClient.put<UserDto, UpdateUserRolesRequest>(
    `/api/v1/User/${id}/roles`,
    body,
  );
}

export async function updateUserWarehouses(
  id: number,
  body: UpdateUserWarehousesRequest,
): Promise<ApiResult<UserDto>> {
  return apiClient.put<UserDto, UpdateUserWarehousesRequest>(
    `/api/v1/User/${id}/warehouses`,
    body,
  );
}

export async function updateUserActiveStatus(
  id: number,
  body: UpdateUserActiveStatusRequest,
): Promise<ApiResult<UserDto>> {
  return apiClient.put<UserDto, UpdateUserActiveStatusRequest>(
    `/api/v1/User/${id}/active-status`,
    body,
  );
}

import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";
import type { ApiResult } from "@/types/http";
import { Success } from "@/services/userService";

export type RoleDto = components["schemas"]["RoleDto"];
export type CreateRoleRequest = components["schemas"]["CreateRoleRequest"];
export type UpdateRolePermissionsRequest =
  components["schemas"]["UpdateRolePermissionsRequest"];

export async function getRoles(): Promise<ApiResult<RoleDto[]>> {
  return apiClient.get<RoleDto[]>("/api/v1/Role");
}

export async function getRole(id: number): Promise<ApiResult<RoleDto>> {
  return apiClient.get<RoleDto>(`/api/v1/Role/${id}`);
}

export async function createRole(
  body: CreateRoleRequest,
): Promise<ApiResult<RoleDto>> {
  return apiClient.post<RoleDto, CreateRoleRequest>("/api/v1/Role", body);
}

export async function deleteRole(id: number): Promise<ApiResult<Success>> {
  return apiClient.delete<Success>(`/api/v1/Role/${id}`);
}

export async function updateRolePermissions(
  id: number,
  body: UpdateRolePermissionsRequest,
): Promise<ApiResult<RoleDto>> {
  return apiClient.put<RoleDto, UpdateRolePermissionsRequest>(
    `/api/v1/Role/${id}/permissions`,
    body,
  );
}

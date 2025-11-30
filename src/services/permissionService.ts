import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";
import type { ApiResult } from "@/types/http";

export type PermissionDto = components["schemas"]["PermissionDto"];

export async function getPermissions(): Promise<ApiResult<PermissionDto[]>> {
  return apiClient.get<PermissionDto[]>("/api/v1/Permission");
}

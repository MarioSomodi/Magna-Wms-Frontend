import { apiClient } from "@/lib/apiClient";
import type { components } from "@/types/api";

export type LoginRequest = components["schemas"]["LoginRequest"];
export type LoginResponse = components["schemas"]["LoginResponse"];

export type RegisterCommand = components["schemas"]["RegisterCommand"];
export type RegisterResponse = components["schemas"]["RegisterResponse"];

export type UserDto = components["schemas"]["UserDto"];

export async function login(body: LoginRequest) {
  return apiClient.post<LoginResponse, LoginRequest>(
    "/api/v1/Authentication/login",
    body,
  );
}

export async function register(body: RegisterCommand) {
  return apiClient.post<RegisterResponse, RegisterCommand>(
    "/api/v1/Authentication/register",
    body,
  );
}

export async function logout() {
  return apiClient.post<void, undefined>(
    "/api/v1/Authentication/logout",
    undefined as never,
  );
}

export async function getCurrentUser() {
  return apiClient.get<UserDto>("/api/v1/Authentication/me");
}

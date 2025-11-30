"use client";

import { createContext, useContext } from "react";
import type { components } from "@/types/api";

export type UserDto = components["schemas"]["UserDto"];

type AuthContextValue = {
  user: UserDto;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return ctx;
}

export function AuthProvider({
  user,
  children,
}: {
  user: UserDto;
  children: React.ReactNode;
}) {
  const value: AuthContextValue = {
    user,
    hasRole: (role: string) => user.roles?.includes(role) ?? false,
    hasPermission: (p: string) => user.permissions?.includes(p) ?? false,
    isSuperAdmin: () => user.roles?.includes("SuperAdmin") ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

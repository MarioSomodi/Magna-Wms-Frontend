import type React from "react";
import { getCurrentUser } from "@/services/authService";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/features/authentication/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getWarehouses } from "@/services/warehouseService";
import { Package } from "lucide-react";
import Link from "next/link";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const userResult = await getCurrentUser();

  if (!userResult.ok) {
    redirect("/logout");
  }

  const user = userResult.data!;

  const warehousesResult = await getWarehouses();
  const warehouses = warehousesResult.ok ? warehousesResult.data : [];

  const accessibleWarehouses = warehouses.filter((w) =>
    user.warehouseIds?.includes(w.id!),
  );

  const roleLabel =
    user?.roles && user.roles.length > 0 ? user.roles.join(", ") : "No roles";
  const initials = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <AuthProvider user={user}>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar warehouses={accessibleWarehouses} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center gap-4 p-4 border-b bg-background">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary">
                <Package className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  MagnaWMS
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.email ?? "Unknown user"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {roleLabel}
                  </p>
                </div>
              </div>
              <ThemeToggle />
              <Link
                href="/logout"
                className="w-full block rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
              >
                Logout
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

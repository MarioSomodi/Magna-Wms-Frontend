import type React from "react";
import { getWarehouses } from "@/services/warehouseService";
import { getCurrentUser } from "@/services/authService";
import { redirect } from "next/navigation";
import { WarehouseProvider } from "@/features/warehouses/WarehouseContext";

interface WarehouseLayoutProps {
  children: React.ReactNode;
  params: { warehouseId: string };
}

export default async function WarehouseLayout({
  children,
  params,
}: WarehouseLayoutProps) {
  const { warehouseId } = await params;
  const warehouseIdNum = Number.parseInt(warehouseId);

  if (Number.isNaN(warehouseIdNum)) {
    redirect("/forbidden");
  }

  const userResult = await getCurrentUser();
  const user = userResult.ok ? userResult.data : null;

  if (!user) {
    redirect("/forbidden");
  }

  // Check if user has access to this warehouse
  if (!user.warehouseIds?.includes(warehouseIdNum)) {
    // Redirect to first accessible warehouse
    const firstWarehouseId = user.warehouseIds?.[0];
    if (firstWarehouseId) {
      redirect(`/warehouses/${firstWarehouseId}`);
    }
    redirect("/forbidden");
  }

  const warehousesResult = await getWarehouses();
  const warehouses = warehousesResult.ok ? warehousesResult.data : [];
  const accessibleWarehouses = warehouses.filter((w) =>
    user.warehouseIds?.includes(w.id!),
  );

  return (
    <WarehouseProvider
      warehouseId={warehouseIdNum}
      warehouses={accessibleWarehouses}
    >
      {children}
    </WarehouseProvider>
  );
}

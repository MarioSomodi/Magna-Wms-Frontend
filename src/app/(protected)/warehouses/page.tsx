import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/authService";
import { getWarehouses } from "@/services/warehouseService";
import WarehouseList from "@/features/warehouses/WarehouseList";
import ProblemDisplay from "@/components/ProblemDisplay";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouses | MagnaWMS",
};

export default async function WarehousesPage() {
  const user = await getCurrentUser();
  if (!user.ok) redirect("/login");

  const warehouses = await getWarehouses();

  if (!warehouses.ok) {
    if (warehouses.status === 403) redirect("/forbidden");

    return (
      <section className="flex justify-center p-10">
        <ProblemDisplay problem={warehouses.problem} context="Warehouse" />
      </section>
    );
  }

  return <WarehouseList warehouses={warehouses.data} />;
}

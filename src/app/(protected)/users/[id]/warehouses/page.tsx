import { getUserById } from "@/services/userService";
import { getWarehouses } from "@/services/warehouseService";
import { notFound } from "next/navigation";
import EditUserWarehouses from "@/features/users/EditUserWarehouses";

type Params = { params: { id: string } };

export default async function UserWarehousesPage({ params }: Params) {
  const parameters = await params;
  const id = Number(parameters.id);

  const userResult = await getUserById(id);
  const warehousesResult = await getWarehouses();

  if (!userResult.ok || !warehousesResult.ok) {
    notFound();
  }

  return (
    <EditUserWarehouses
      user={userResult.data!}
      warehouses={warehousesResult.data!}
    />
  );
}

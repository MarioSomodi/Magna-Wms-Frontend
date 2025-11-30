import { notFound } from "next/navigation";
import { getRole } from "@/services/roleService";
import { getPermissions } from "@/services/permissionService";
import EditRolePermissions from "@/features/roles/EditRolePermissions";

type Params = { params: { id: string } };

export default async function RolePermissionsPage({ params }: Params) {
  const parameters = await params;
  const id = Number(parameters.id);

  const roleResult = await getRole(id);
  const permsResult = await getPermissions();

  if (!roleResult.ok || !permsResult.ok) {
    notFound();
  }

  return (
    <EditRolePermissions
      role={roleResult.data!}
      permissions={permsResult.data!}
    />
  );
}

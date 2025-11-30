import { getUserById } from "@/services/userService";
import { getRoles } from "@/services/roleService";
import { notFound } from "next/navigation";
import EditUserRoles from "@/features/users/EditUserRoles";

type Params = { params: { id: string } };

export default async function UserRolesPage({ params }: Params) {
  const parameters = await params;
  const id = Number(parameters.id);

  const userResult = await getUserById(id);
  const rolesResult = await getRoles();

  if (!userResult.ok || !rolesResult.ok) {
    notFound();
  }

  return <EditUserRoles user={userResult.data!} roles={rolesResult.data!} />;
}

import { notFound, redirect } from "next/navigation";
import { getRoles, type RoleDto } from "@/services/roleService";
import type { ApiResult } from "@/types/http";
import RoleDetails from "@/features/roles/RoleDetails";
import ProblemDisplay from "@/components/ProblemDisplay";

type Params = { params: { id: string } };

export default async function RoleDetailsPage({ params }: Params) {
  const parameters = await params;
  const id = Number(parameters.id);

  if (!id || Number.isNaN(id)) {
    notFound();
  }

  const result: ApiResult<RoleDto[]> = await getRoles();

  if (!result.ok) {
    if (result.status === 403) {
      redirect("/forbidden");
    }

    return (
      <section className="flex flex-col items-center justify-center p-10">
        <ProblemDisplay problem={result.problem} context="Role" />
      </section>
    );
  }

  const role = result.data!.find((r) => r.id === id);

  if (!role) {
    notFound();
  }

  return <RoleDetails role={role!} />;
}

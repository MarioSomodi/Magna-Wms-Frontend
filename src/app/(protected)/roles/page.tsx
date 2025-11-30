import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getRoles, type RoleDto } from "@/services/roleService";
import type { ApiResult } from "@/types/http";
import RolesList from "@/features/roles/RolesList";
import ProblemDisplay from "@/components/ProblemDisplay";

export const metadata: Metadata = {
  title: "Roles | MagnaWMS",
};

export default async function RolesPage() {
  const result: ApiResult<RoleDto[]> = await getRoles();

  if (!result.ok) {
    if (result.status === 403) {
      redirect("/forbidden");
    }

    return (
      <section className="flex flex-col items-center justify-center p-10">
        <ProblemDisplay problem={result.problem} context="Roles" />
      </section>
    );
  }

  return (
    <section className="p-8 space-y-6">
      <RolesList roles={result.data!} />
    </section>
  );
}

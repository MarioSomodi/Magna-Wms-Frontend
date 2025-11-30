import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUsers, UserDto } from "@/services/userService";
import { getWarehouses, WarehouseDto } from "@/services/warehouseService";
import ProblemDisplay from "@/components/ProblemDisplay";
import UsersList from "@/features/users/UsersList";
import type { ApiResult } from "@/types/http";

export const metadata: Metadata = {
  title: "Users | MagnaWMS",
};

export default async function UsersPage() {
  const [usersResult, warehousesResult]: [
    ApiResult<UserDto[]>,
    ApiResult<WarehouseDto[]>,
  ] = await Promise.all([getUsers(), getWarehouses()]);

  if (!usersResult.ok) {
    if (usersResult.status === 403) {
      redirect("/forbidden");
    }

    return (
      <section className="flex flex-col items-center justify-center p-10">
        <ProblemDisplay problem={usersResult.problem} context="Users" />
      </section>
    );
  }

  if (!warehousesResult.ok) {
    return (
      <section className="flex flex-col items-center justify-center p-10">
        <ProblemDisplay problem={warehousesResult.problem} context="Users" />
      </section>
    );
  }

  const users = usersResult.data ?? [];
  const warehouses = warehousesResult.data ?? [];

  return (
    <section className="p-8 space-y-6">
      <UsersList users={users} warehouses={warehouses} />
    </section>
  );
}

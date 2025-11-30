import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { getUserById, UserDto } from "@/services/userService";
import { getWarehouses, WarehouseDto } from "@/services/warehouseService";
import ProblemDisplay from "@/components/ProblemDisplay";
import type { ApiResult } from "@/types/http";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "User details | MagnaWMS",
};

export default async function UserDetailPage({ params }: Props) {
  const parameters = await params;
  const userId = Number(await parameters.id);
  if (Number.isNaN(userId)) {
    notFound();
  }

  const [userResult, warehousesResult]: [
    ApiResult<UserDto>,
    ApiResult<WarehouseDto[]>,
  ] = await Promise.all([getUserById(userId), getWarehouses()]);

  if (!userResult.ok) {
    if (userResult.status === 404) {
      notFound();
    }
    if (userResult.status === 403) {
      redirect("/forbidden");
    }

    return (
      <section className="flex flex-col items-center justify-center p-10">
        <ProblemDisplay problem={userResult.problem} context="User" />
      </section>
    );
  }

  if (!warehousesResult.ok) {
    return (
      <section className="flex flex-col items-center justify-center p-10">
        <ProblemDisplay problem={warehousesResult.problem} context="User" />
      </section>
    );
  }

  const user = userResult.data;
  const warehouses = warehousesResult.data ?? [];

  const warehouseMap = new Map<number, WarehouseDto>();
  for (const w of warehouses) {
    if (w.id != null) warehouseMap.set(Number(w.id), w);
  }

  const userWarehouses = (user.warehouseIds ?? [])
    .map((id) => warehouseMap.get(Number(id)))
    .filter(Boolean) as WarehouseDto[];

  const roles = user.roles ?? [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant={user.isActive ? "default" : "secondary"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">User ID</div>
              <div className="font-medium">{user.id}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Roles</CardTitle>
            <Button size="sm" asChild>
              <Link href={`/users/${user.id}/roles`}>Edit</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {roles.map((roleName) => (
                <Badge key={roleName} variant="outline">
                  {roleName}
                </Badge>
              ))}
              {roles.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No roles assigned
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Warehouse Access</CardTitle>
            <Button size="sm" asChild>
              <Link href={`/users/${user.id}/warehouses`}>Edit</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userWarehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <div className="font-medium">
                      {warehouse.name ??
                        warehouse.code ??
                        `Warehouse ${warehouse.id}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {warehouse.id}{" "}
                      {warehouse.timeZone ? `• ${warehouse.timeZone}` : null}
                    </div>
                  </div>
                </div>
              ))}
              {userWarehouses.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No warehouse access assigned
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

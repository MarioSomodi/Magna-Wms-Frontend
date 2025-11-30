"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Edit,
  Search,
  Shield,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import type { UserDto } from "@/services/userService";
import type { WarehouseDto } from "@/services/warehouseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleUserActiveAction } from "@/app/_actions/users/toggleUserActiveAction";
import { ServerActionResult } from "@/types/http";
import { deleteUserAction } from "@/app/_actions/users/deleteUserAction";
import { showError, showProblem, showSuccess } from "@/lib/toast";
import { DeleteDialog } from "@/components/DeleteDialog";

type UsersListProps = {
  users: UserDto[];
  warehouses: WarehouseDto[];
};

export default function UsersList({ users, warehouses }: UsersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const deleteFormRefs = useRef<Map<number, HTMLFormElement>>(new Map());
  const initial = {} as ServerActionResult;

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteUserAction,
    initial,
  );

  useEffect(() => {
    if (deleteState === initial) return;
    if ("problem" in deleteState) {
      showProblem(deleteState.problem);
    } else if (!deleteState.ok) {
      showError(deleteState.error);
    } else if (deleteState.ok) {
      showSuccess("User deleted");
    }
  }, [deleteState, initial]);

  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleUserActiveAction,
    initial,
  );

  useEffect(() => {
    if (toggleState === initial) return;
    if ("problem" in toggleState) {
      showProblem(toggleState.problem);
    } else if (!toggleState.ok) {
      showError(toggleState.error);
    } else if (toggleState.ok) {
      showSuccess("User active state updated");
    }
  }, [initial, toggleState]);

  const warehouseMap = useMemo(() => {
    const map = new Map<number, WarehouseDto>();
    for (const w of warehouses) {
      if (w.id != null) {
        map.set(Number(w.id), w);
      }
    }
    return map;
  }, [warehouses]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const email = user.email ?? "";
      const matchesSearch = email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const isActive = Boolean(user.isActive);
      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && isActive) ||
        (activeFilter === "inactive" && !isActive);

      return matchesSearch && matchesActive;
    });
  }, [users, searchQuery, activeFilter]);

  const totalUsers = users.length;
  const totalActive = users.filter((u) => u.isActive).length;
  const totalInactive = totalUsers - totalActive;
  const anyPending = deletePending || togglePending;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and access
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInactive}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={activeFilter}
                onValueChange={(value) => setActiveFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Warehouses</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const userRoles = user.roles ?? [];
                const warehouseIds = user.warehouseIds ?? [];
                const resolvedWarehouses = warehouseIds
                  .map((id) => warehouseMap.get(Number(id)))
                  .filter(Boolean) as WarehouseDto[];

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.email ?? "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {userRoles.map((roleName) => (
                          <Badge key={roleName} variant="outline">
                            {roleName}
                          </Badge>
                        ))}
                        {userRoles.length === 0 && (
                          <span className="text-xs text-muted-foreground">
                            No roles
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {resolvedWarehouses.slice(0, 2).map((warehouse) => (
                          <Badge
                            key={warehouse.id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <WarehouseIcon className="h-3 w-3" />
                            {warehouse.name ??
                              warehouse.code ??
                              `Warehouse ${warehouse.id}`}
                          </Badge>
                        ))}
                        {resolvedWarehouses.length > 2 && (
                          <Badge variant="secondary">
                            +{resolvedWarehouses.length - 2}
                          </Badge>
                        )}
                        {resolvedWarehouses.length === 0 && (
                          <span className="text-xs text-muted-foreground">
                            No access
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/users/${user.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>

                        <form action={toggleAction}>
                          <input type="hidden" name="id" value={user.id} />
                          <input
                            type="hidden"
                            name="active"
                            value={String(user.isActive)}
                          />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            disabled={anyPending}
                            aria-label={
                              user.isActive
                                ? "Deactivate user"
                                : "Activate user"
                            }
                          >
                            {user.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </form>

                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/users/${user.id}/roles`}>
                            <Shield className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/users/${user.id}/warehouses`}>
                            <WarehouseIcon className="h-4 w-4" />
                          </Link>
                        </Button>

                        <form
                          action={deleteAction}
                          ref={(el) => {
                            if (el) deleteFormRefs.current.set(user.id!, el);
                            else deleteFormRefs.current.delete(user.id!);
                          }}
                        >
                          <input type="hidden" name="id" value={user.id} />

                          <DeleteDialog
                            formRef={deleteFormRefs}
                            id={user.id!}
                            title="Delete user"
                            description={`Are you sure you want to delete ${user.email}?`}
                            trigger={
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                disabled={deletePending}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            }
                          />
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

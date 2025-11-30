"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Edit, KeyRound, Plus, Search, Shield, Trash2 } from "lucide-react";

import type { RoleDto } from "@/services/roleService";
import type { ServerActionResult } from "@/types/http";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createRoleAction } from "@/app/_actions/roles/createRoleAction";
import { deleteRoleAction } from "@/app/_actions/roles/deleteRoleAction";
import { showError, showProblem, showSuccess } from "@/lib/toast";
import { DeleteDialog } from "@/components/DeleteDialog";

type Props = {
  roles: RoleDto[];
};

export default function RolesList({ roles }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const inital = {} as ServerActionResult;

  const [createState, createAction, createPending] = useActionState<
    ServerActionResult,
    FormData
  >(createRoleAction, inital);

  useEffect(() => {
    if (createState === inital) return;
    if ("problem" in createState) showProblem(createState.problem);
    else if (!createState.ok) showError(createState.error);
    else if (createState.ok) {
      showSuccess("Role created.");
    }
  }, [createState, inital]);

  const [deleteState, deleteAction, deletePending] = useActionState<
    ServerActionResult,
    FormData
  >(deleteRoleAction, inital);

  useEffect(() => {
    if (deleteState === inital) return;
    if ("problem" in deleteState) showProblem(deleteState.problem);
    else if (!deleteState.ok) showError(deleteState.error);
    else if (deleteState.ok) showSuccess("Role deleted.");
  }, [deleteState, inital]);

  const deleteFormRefs = useRef<Map<number, HTMLFormElement>>(new Map());

  const filteredRoles = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return roles.filter((role) => {
      const name = role.name ?? "";
      return name.toLowerCase().includes(query);
    });
  }, [roles, searchQuery]);

  const totalRoles = roles.length;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and their permissions.
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Add a new role to the system.
              </DialogDescription>
            </DialogHeader>

            <form action={createAction}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label
                    htmlFor="roleName"
                    className="text-sm font-medium leading-none"
                  >
                    Role Name
                  </label>
                  <Input
                    id="roleName"
                    name="name"
                    placeholder="e.g., WarehouseOperator"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="roleDescription"
                    className="text-sm font-medium leading-none"
                  >
                    Description (optional)
                  </label>
                  <Input
                    id="roleDescription"
                    name="description"
                    placeholder="Short description for this role"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPending}
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                  }}
                >
                  {createPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <CardTitle className="text-sm font-medium">
              Total Roles: {totalRoles}
            </CardTitle>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => {
                const permissionCount = role.permissions?.length ?? 0;

                return (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {role.name ?? "(Unnamed role)"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {role.description ?? (
                        <span className="text-xs text-muted-foreground">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {permissionCount} permission
                        {permissionCount === 1 ? "" : "s"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/roles/${role.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>

                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/roles/${role.id}/permissions`}>
                            <KeyRound className="h-4 w-4 mr-1" />
                          </Link>
                        </Button>

                        <form
                          action={deleteAction}
                          ref={(el) => {
                            if (el) deleteFormRefs.current.set(role.id!, el);
                            else deleteFormRefs.current.delete(role.id!);
                          }}
                        >
                          <input type="hidden" name="id" value={role.id} />
                          <DeleteDialog
                            formRef={deleteFormRefs}
                            id={role.id}
                            title="Delete role"
                            description={`Are you sure you want to delete role "${role.name}"? This cannot be undone.`}
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

          {filteredRoles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No roles found.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

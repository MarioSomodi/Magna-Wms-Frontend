"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { RoleDto } from "@/services/roleService";
import type { PermissionDto } from "@/services/permissionService";
import type { ServerActionResult } from "@/types/http";

import { updateRolePermissionsAction } from "@/app/_actions/roles/updateRolePermissionsAction";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { showError, showProblem, showSuccess } from "@/lib/toast";

type Props = {
  role: RoleDto;
  permissions: PermissionDto[];
};

export default function EditRolePermissions({ role, permissions }: Props) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    (role.permissions ?? []).map((p) => p).filter(Boolean),
  );

  const initial = {} as ServerActionResult;
  const [state, formAction, pending] = useActionState<
    ServerActionResult,
    FormData
  >(updateRolePermissionsAction, initial);

  useEffect(() => {
    if (state === initial) return;

    if ("problem" in state) {
      showProblem(state.problem);
    } else if (!state.ok) {
      showError(state.error);
    } else if (state.ok) {
      showSuccess("Role permissions updated");
    }
  }, [state, initial]);

  // Group permissions by category
  const grouped = permissions.reduce(
    (acc, p) => {
      const category = (p.key ?? "").split(".")[0] || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(p);
      return acc;
    },
    {} as Record<string, PermissionDto[]>,
  );

  return (
    <div className="p-8 w-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/roles/${role.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">
        Edit Role Permissions
      </h1>
      <p className="text-muted-foreground">{role.name}</p>

      <form action={formAction}>
        <input type="hidden" name="id" value={String(role.id)} />

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(grouped).map(([category, perms]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
                <CardDescription>
                  {perms.length} permission{perms.length === 1 ? "" : "s"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {perms.map((perm) => (
                  <div key={perm.key} className="flex items-start space-x-2">
                    <Checkbox
                      id={`perm-${perm.key}`}
                      checked={selectedKeys.includes(perm.key!)}
                      onCheckedChange={(checked) => {
                        let next = [...selectedKeys];
                        if (checked) next.push(perm.key!);
                        else next = next.filter((k) => k !== perm.key);
                        setSelectedKeys(next);
                      }}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`perm-${perm.key}`}
                        className="cursor-pointer font-medium text-sm"
                      >
                        {perm.key}
                      </Label>
                      {perm.description && (
                        <p className="text-sm text-muted-foreground">
                          {perm.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <input
          type="hidden"
          name="permissionKeys"
          value={JSON.stringify(selectedKeys)}
        />

        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/roles/${role.id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

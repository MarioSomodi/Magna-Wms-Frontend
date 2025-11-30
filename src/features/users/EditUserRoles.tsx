"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { UserDto } from "@/services/userService";
import type { RoleDto } from "@/services/roleService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateUserRolesAction } from "@/app/_actions/users/updateUserRolesAction";
import type { ServerActionResult } from "@/types/http";
import { showError, showProblem, showSuccess } from "@/lib/toast";

type Props = {
  user: UserDto;
  roles: RoleDto[];
};

export default function EditUserRoles({ user, roles }: Props) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    resolveRoleIds(user, roles),
  );

  function resolveRoleIds(user: UserDto, roles: RoleDto[]): number[] {
    const userRoleNames = user.roles ?? [];
    return roles
      .filter((r) => userRoleNames.includes(r.name ?? ""))
      .map((r) => Number(r.id));
  }

  const initial = {} as ServerActionResult;

  const [state, formAction, pending] = useActionState<
    ServerActionResult,
    FormData
  >(updateUserRolesAction, initial);

  useEffect(() => {
    if (state === initial) return;
    if ("problem" in state) showProblem(state.problem);
    else if (!state.ok) showError(state.error);
    else if (state.ok) {
      showSuccess("Users roles updated");
    }
  }, [initial, state]);

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/users/${user.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">Edit User Roles</h1>
      <p className="text-muted-foreground">{user.email}</p>

      <form action={formAction}>
        <input type="hidden" name="id" value={String(user.id)} />

        <Card>
          <CardHeader>
            <CardTitle>Select Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRoleIds.includes(role.id!)}
                  onCheckedChange={(checked) => {
                    let next = [...selectedRoleIds];
                    if (checked) next.push(role.id!);
                    else next = next.filter((id) => id !== role.id);
                    setSelectedRoleIds(next);
                  }}
                />
                <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                  {role.name}
                </Label>
              </div>
            ))}

            <input
              type="hidden"
              name="roleIds"
              value={JSON.stringify(selectedRoleIds)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/users/${user.id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

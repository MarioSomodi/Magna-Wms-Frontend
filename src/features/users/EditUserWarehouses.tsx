"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { UserDto } from "@/services/userService";
import type { WarehouseDto } from "@/services/warehouseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updateUserWarehousesAction } from "@/app/_actions/users/updateUserWarehousesAction";
import type { ServerActionResult } from "@/types/http";
import { showError, showProblem, showSuccess } from "@/lib/toast";

type Props = {
  user: UserDto;
  warehouses: WarehouseDto[];
};

export default function EditUserWarehouses({ user, warehouses }: Props) {
  const [selected, setSelected] = useState<number[]>(
    user.warehouseIds?.map((id) => Number(id)) ?? [],
  );

  const initial = {} as ServerActionResult;

  const [state, formAction, pending] = useActionState<
    ServerActionResult,
    FormData
  >(updateUserWarehousesAction, initial);

  useEffect(() => {
    if (initial === state) return;
    if ("problem" in state) showProblem(state.problem);
    else if (!state.ok) showError(state.error);
    else showSuccess("Users warehouse access updated");
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

      <h1 className="text-3xl font-bold tracking-tight">
        Edit Warehouse Access
      </h1>
      <p className="text-muted-foreground">{user.email}</p>

      <form action={formAction}>
        <input type="hidden" name="id" value={String(user.id)} />

        <Card>
          <CardHeader>
            <CardTitle>Select Warehouses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {warehouses.map((w) => (
              <div key={w.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`wh-${w.id}`}
                  checked={selected.includes(w.id!)}
                  onCheckedChange={(c) => {
                    let arr = [...selected];
                    if (c) arr.push(w.id!);
                    else arr = arr.filter((id) => id !== w.id);
                    setSelected(arr);
                  }}
                />
                <div>
                  <Label htmlFor={`wh-${w.id}`}>{w.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    {w.code} • {w.timeZone}
                  </p>
                </div>
              </div>
            ))}

            <input
              type="hidden"
              name="warehouseIds"
              value={JSON.stringify(selected)}
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

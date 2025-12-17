/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useActionState, useEffect, useState } from "react";

import type { WarehouseDto } from "@/services/warehouseService";
import type { ServerActionResult } from "@/types/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Pencil, Plus, ToggleLeft, ToggleRight, Warehouse } from "lucide-react";
import { createWarehouseAction } from "@/app/_actions/warehouses/createWarehouseAction";
import { showProblem, showSuccess } from "@/lib/toast";
import { Label } from "@/components/ui/label";
import { updateWarehouseAction } from "@/app/_actions/warehouses/updateWarehouseAction";
import { activateWarehouseAction } from "@/app/_actions/warehouses/activateWarehouseActions";
import { deactivateWarehouseAction } from "@/app/_actions/warehouses/deactivateWarehouseActions";

type Props = { initialWarehouses: WarehouseDto[] };

export default function WarehousesClient({ initialWarehouses }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseDto | null>(
    null,
  );

  const [editForm, setEditForm] = useState({
    code: "",
    name: "",
    timeZone: "",
  });
  function openEditDialog(wh: WarehouseDto) {
    setEditingWarehouse(wh);
    setEditForm({
      code: wh.code ?? "",
      name: wh.name ?? "",
      timeZone: wh.timeZone ?? "",
    });
    setIsEditOpen(true);
  }

  const initial = {} as ServerActionResult;
  const [createState, createFormAction, createPending] = useActionState<
    ServerActionResult,
    FormData
  >(createWarehouseAction, initial);

  useEffect(() => {
    if (createState === initial) return;
    if ("problem" in createState) showProblem(createState.problem);
    else if (createState.ok) {
      showSuccess("Success", "Warehouse created");
      setIsCreateOpen(false);
    }
  }, [createState, initial]);

  const [updateState, updateFormAction, updatePending] = useActionState<
    ServerActionResult,
    FormData
  >(updateWarehouseAction, initial);

  useEffect(() => {
    if (updateState === initial) return;
    if ("problem" in updateState) showProblem(updateState.problem);
    else if (updateState.ok) {
      showSuccess("Success", "Warehouse updated");
      setIsEditOpen(false);
      setEditingWarehouse(null);
    }
  }, [updateState, initial]);

  const [activateState, activateFormAction, activatePending] = useActionState<
    ServerActionResult,
    FormData
  >(activateWarehouseAction, initial);

  useEffect(() => {
    if (activateState === initial) return;
    if ("problem" in activateState) showProblem(activateState.problem);
    else if (activateState.ok) showSuccess("Success", "Warehouse activated");
  }, [activateState, initial]);

  const [deactivateState, deactivateFormAction, deactivatePending] =
    useActionState<ServerActionResult, FormData>(
      deactivateWarehouseAction,
      initial,
    );

  useEffect(() => {
    if (deactivateState === initial) return;
    if ("problem" in deactivateState) showProblem(deactivateState.problem);
    else if (deactivateState.ok)
      showSuccess("Success", "Warehouse deactivated");
  }, [deactivateState, initial]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouse configurations
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {initialWarehouses.map((wh) => (
                <TableRow key={wh.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-muted-foreground" />
                      {wh.code}
                    </div>
                  </TableCell>
                  <TableCell>{wh.name}</TableCell>
                  <TableCell>{wh.timeZone}</TableCell>
                  <TableCell>
                    <Badge variant={wh.isActive ? "default" : "secondary"}>
                      {wh.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(wh.createdUtc!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          openEditDialog(wh)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <form
                        action={
                          wh.isActive
                            ? deactivateFormAction
                            : activateFormAction
                        }
                      >
                        <input type="hidden" name="id" value={wh.id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          disabled={activatePending || deactivatePending}
                        >
                          {wh.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Warehouse</DialogTitle>
            <DialogDescription>Enter warehouse details</DialogDescription>
          </DialogHeader>

          <form action={createFormAction}>
            <div className="space-y-4 py-4">
              <Label>Code</Label>
              <Input name="code" required />

              <Label>Name</Label>
              <Input name="name" required />

              <Label>Time Zone</Label>
              <Input name="timeZone" required />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createPending}>
                {createPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
          </DialogHeader>

          <form action={updateFormAction}>
            <input type="hidden" name="id" value={editingWarehouse?.id} />
            <input type="hidden" name="code" value={editForm.code} />
            <input type="hidden" name="name" value={editForm.name} />
            <input type="hidden" name="timeZone" value={editForm.timeZone} />
            <div className="space-y-4 py-4">
              <Label>Code</Label>
              <Input
                value={editForm.code}
                onChange={(e) =>
                  setEditForm({ ...editForm, code: e.target.value })
                }
                required
              />

              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />

              <Label>Time Zone</Label>
              <Input
                value={editForm.timeZone}
                onChange={(e) =>
                  setEditForm({ ...editForm, timeZone: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updatePending}>
                {updatePending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

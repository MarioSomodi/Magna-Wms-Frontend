"use client";

import { useMemo, useState } from "react";
import { Search, Warehouse } from "lucide-react";
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
import { WarehouseDto } from "@/services/warehouseService";

export default function WarehouseList({
  warehouses,
}: {
  warehouses: WarehouseDto[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(
      (w) =>
        w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.code?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, warehouses]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
        <p className="text-muted-foreground">
          Manage warehouse locations and configurations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Warehouses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {warehouses.filter((w) => w.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {warehouses.filter((w) => !w.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search warehouses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Time Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredWarehouses.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-muted-foreground" />
                      {w.code}
                    </div>
                  </TableCell>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.timeZone}</TableCell>
                  <TableCell>
                    <Badge variant={w.isActive ? "default" : "secondary"}>
                      {w.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(w.createdUtc ?? "").toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredWarehouses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No warehouses found or no warehouses assigned to you
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

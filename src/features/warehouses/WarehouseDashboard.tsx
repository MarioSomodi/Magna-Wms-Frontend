"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Package,
  PackageCheck,
  PackagePlus,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InventoryDto } from "@/services/inventoryService";
import type { ReceiptDto } from "@/services/receiptService";
import type { SalesOrderDto } from "@/services/salesOrderService";
import { useWarehouse } from "@/features/warehouses/WarehouseContext";

type WarehouseDashboardProps = {
  receipts: ReceiptDto[];
  salesOrders: SalesOrderDto[];
  inventory: InventoryDto[];
};

export function WarehouseDashboard({
  inventory,
  receipts,
  salesOrders,
}: WarehouseDashboardProps) {
  const { warehouseId, warehouse } = useWarehouse();

  const totalOnHand = inventory.reduce(
    (sum, inv) => sum + inv.quantityOnHand!,
    0,
  );
  const totalAvailable = inventory.reduce(
    (sum, inv) => sum + inv.quantityAvailable!,
    0,
  );
  const lowStockCount = inventory.filter(
    (inv) => inv.quantityAvailable! < 10,
  ).length;

  const openReceipts = receipts.filter(
    (r) => r.status?.toLowerCase() === "open",
  ).length;
  const openOrders = salesOrders.filter(
    (o) => o.status?.toLowerCase() === "open",
  ).length;

  const recentReceipts = receipts.slice(0, 5);
  const recentOrders = salesOrders.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {warehouse?.name || `Warehouse ${warehouseId}`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Items in Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOnHand.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAvailable.toLocaleString()} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Receipts</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openReceipts}</div>
            <p className="text-xs text-muted-foreground">
              {receipts.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOrders}</div>
            <p className="text-xs text-muted-foreground">
              {salesOrders.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Below threshold</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Receipts</CardTitle>
                <CardDescription>Latest inbound receipts</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/warehouses/${warehouseId}/inbound/receipts`}>
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReceipts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No receipts yet
                </p>
              ) : (
                recentReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {receipt.receiptNumber || `Receipt #${receipt.id}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {receipt.externalReference || "-"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        receipt.status?.toLowerCase() === "closed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {receipt.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest sales orders</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/warehouses/${warehouseId}/outbound/sales-orders`}>
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No orders yet
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {order.orderNumber || `Order #${order.id}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerName || "-"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status?.toLowerCase() === "shipped"
                          ? "default"
                          : order.status?.toLowerCase() === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5" />
              Inbound
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Link href={`/warehouses/${warehouseId}/inbound/receipts`}>
                <PackageCheck className="h-4 w-4 mr-2" />
                Receipts ({openReceipts})
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Link href={`/warehouses/${warehouseId}/inbound/putaway`}>
                <ClipboardList className="h-4 w-4 mr-2" />
                Putaway Tasks
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Outbound
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Link href={`/warehouses/${warehouseId}/outbound/sales-orders`}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sales Orders ({openOrders})
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Link href={`/warehouses/${warehouseId}/outbound/pick-tasks`}>
                <ClipboardList className="h-4 w-4 mr-2" />
                Pick Tasks
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Link href={`/warehouses/${warehouseId}/inventory`}>
                <Package className="h-4 w-4 mr-2" />
                Stock Overview
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Link href={`/warehouses/${warehouseId}/forecasting`}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Forecasting
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

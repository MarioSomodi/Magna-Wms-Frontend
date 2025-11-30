import { WarehouseDashboard } from "@/features/warehouses/WarehouseDashboard";
import { getReceiptsByWarehouse } from "@/services/receiptService";
import { getSalesOrdersByWarehouse } from "@/services/salesOrderService";
import { getInventory } from "@/services/inventoryService";

interface DashboardPageProps {
  params: { warehouseId: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { warehouseId } = await params;
  const warehouseIdNum = Number.parseInt(warehouseId);

  const [receiptsResult, salesOrdersResult, inventoryResult] =
    await Promise.all([
      getReceiptsByWarehouse(warehouseIdNum),
      getSalesOrdersByWarehouse(warehouseIdNum),
      getInventory(warehouseIdNum),
    ]);

  const receipts = receiptsResult.ok ? receiptsResult.data : [];
  const salesOrders = salesOrdersResult.ok ? salesOrdersResult.data : [];
  const inventory = inventoryResult.ok ? inventoryResult.data : [];

  return (
    <WarehouseDashboard
      receipts={receipts}
      salesOrders={salesOrders}
      inventory={inventory}
    />
  );
}

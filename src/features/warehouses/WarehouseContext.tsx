"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { WarehouseDto } from "@/services/warehouseService";

type WarehouseContextType = {
  warehouseId: number;
  warehouse: WarehouseDto | null;
  warehouses: WarehouseDto[];
};

const WarehouseContext = createContext<WarehouseContextType | null>(null);

export function WarehouseProvider({
  warehouseId,
  warehouses,
  children,
}: {
  warehouseId: number;
  warehouses: WarehouseDto[];
  children: ReactNode;
}) {
  const warehouse = warehouses.find((w) => w.id === warehouseId) || null;

  return (
    <WarehouseContext.Provider value={{ warehouseId, warehouse, warehouses }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error("useWarehouse must be used within WarehouseProvider");
  }
  return context;
}

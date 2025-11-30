"use client";

import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Package,
  PackageCheck,
  PackageOpen,
  PackagePlus,
  RefreshCw,
  Shield,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/authentication/AuthContext";
import { WarehouseDto } from "@/services/warehouseService";
import { WarehouseSelector } from "@/features/warehouses/WarehouseSelector";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  permissions: string[];
  warehouseScoped: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

interface AppSidebarProps {
  warehouses: WarehouseDto[];
}

export function AppSidebar({ warehouses }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, isSuperAdmin, hasPermission } = useAuth();
  const warehouseMatch = pathname.match(/^\/warehouses\/(\d+)/);
  const currentWarehouseId = warehouseMatch
    ? Number.parseInt(warehouseMatch[1])
    : null;

  const navSections: NavSection[] = [
    {
      title: "GENERAL",
      items: [
        {
          label: "Dashboard",
          path: "",
          icon: <LayoutDashboard className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: [],
        },
      ],
    },
    {
      title: "INVENTORY",
      items: [
        {
          label: "Stock Overview",
          path: "/inventory",
          icon: <PackageOpen className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Inventory.Read", "Inventory.Ledger.Read"],
        },
      ],
    },
    {
      title: "INBOUND",
      items: [
        {
          label: "Receipts",
          path: "/inbound/receipts",
          icon: <PackageCheck className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Warehouses.Read"],
        },
        {
          label: "Putaway Tasks",
          path: "/inbound/putaway",
          icon: <PackagePlus className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Warehouses.Read"],
        },
      ],
    },
    {
      title: "OUTBOUND",
      items: [
        {
          label: "Sales Orders",
          path: "/outbound/sales-orders",
          icon: <ShoppingCart className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Warehouses.Read"],
        },
        {
          label: "Pick Tasks",
          path: "/outbound/pick-tasks",
          icon: <ClipboardList className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Warehouses.Read"],
        },
        {
          label: "Shipments",
          path: "/outbound/shipments",
          icon: <Truck className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Warehouses.Read"],
        },
      ],
    },
    {
      title: "ITEMS & PLANNING",
      items: [
        {
          label: "Items",
          path: "/items",
          icon: <Package className="h-5 w-5" />,
          warehouseScoped: false,
          permissions: ["Items.Read"],
        },
        {
          label: "Forecasting",
          path: "/forecasting",
          icon: <BarChart3 className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Warehouses.Read"],
        },
        {
          label: "Replenishment",
          path: "/replenishment",
          icon: <RefreshCw className="h-5 w-5" />,
          warehouseScoped: true,
          permissions: ["Warehouses.Read"],
        },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        {
          label: "Users",
          path: "/users",
          icon: <Users className="h-5 w-5" />,
          warehouseScoped: false,
          permissions: ["Security.Manager"],
        },
        {
          label: "Roles",
          path: "/roles",
          icon: <Shield className="h-5 w-5" />,
          warehouseScoped: false,
          permissions: ["Security.Manager"],
        },
        {
          label: "Warehouses",
          path: "/warehouses",
          icon: <Warehouse className="h-5 w-5" />,
          permissions: ["Warehouses.Read"],
          warehouseScoped: false,
        },
      ],
    },
  ];

  const buildHref = (item: NavItem) => {
    if (item.warehouseScoped) {
      // For warehouse-scoped items, we need a warehouse selected
      if (!currentWarehouseId) {
        // If no warehouse selected, use first accessible warehouse
        const firstWarehouse = warehouses[0];
        if (firstWarehouse) {
          return `/warehouses/${firstWarehouse.id}${item.path}`;
        }
        return "#";
      }
      return `/warehouses/${currentWarehouseId}${item.path}`;
    }
    return item.path;
  };

  return (
    <aside className="w-64 border-r bg-muted/40 flex flex-col">
      {currentWarehouseId && warehouses.length > 0 && (
        <div className="p-4 space-y-4">
          <WarehouseSelector
            warehouses={warehouses}
            currentWarehouseId={currentWarehouseId}
          />
        </div>
      )}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => {
            if (isSuperAdmin() && !item.warehouseScoped) return true;
            if (isSuperAdmin() && item.warehouseScoped && warehouses.length > 0)
              return true;
            item.permissions.forEach((permission) => {
              if (!hasPermission(permission)) return false;
            });
            // Hide warehouse-scoped items if no warehouse available
            return !(item.warehouseScoped && warehouses.length === 0);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-3">
                {section.title}
              </h2>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const href = buildHref(item);
                  const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);

                  return (
                    <Link
                      key={item.path}
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        href === "#" && "opacity-50 pointer-events-none",
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

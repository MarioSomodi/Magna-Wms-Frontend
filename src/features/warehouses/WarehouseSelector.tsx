"use client";

import { Check, ChevronsUpDown, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { WarehouseDto } from "@/services/warehouseService";

interface WarehouseSelectorProps {
  warehouses: WarehouseDto[];
  currentWarehouseId: number;
}

export function WarehouseSelector({
  warehouses,
  currentWarehouseId,
}: WarehouseSelectorProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentWarehouse = warehouses.find((w) => w.id === currentWarehouseId);

  const handleSelect = (newWarehouseId: number) => {
    if (newWarehouseId === currentWarehouseId) {
      setOpen(false);
      return;
    }

    // Replace the current warehouse ID in the pathname with the new one
    const newPath = pathname.replace(
      `/warehouses/${currentWarehouseId}`,
      `/warehouses/${newWarehouseId}`,
    );
    router.push(newPath);
    setOpen(false);
  };

  if (warehouses.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Warehouse className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {currentWarehouse ? currentWarehouse.name : "Select warehouse..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search warehouse..." />
          <CommandList>
            <CommandEmpty>No warehouse found.</CommandEmpty>
            <CommandGroup>
              {warehouses.map((wh) => (
                <CommandItem
                  key={wh.id}
                  value={wh.name!}
                  onSelect={() => handleSelect(wh.id!)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentWarehouseId === wh.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {wh.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

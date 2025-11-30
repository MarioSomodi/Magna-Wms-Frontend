"use client";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => document.documentElement.classList.toggle("dark")}
      className="block rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
    >
      Toggle theme
    </Button>
  );
}

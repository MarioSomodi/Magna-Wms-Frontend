"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { RoleDto } from "@/services/roleService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  role: RoleDto;
};

export default function RoleDetails({ role }: Props) {
  const permissions = role.permissions ?? [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/roles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Role Details</h1>
        <p className="text-muted-foreground">{role.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Role Name</div>
              <div className="font-medium">{role.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Role ID</div>
              <div className="font-medium">{role.id}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Description</div>
              <div className="font-medium">
                {role.description ?? (
                  <span className="text-xs text-muted-foreground">
                    No description
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Permissions</CardTitle>
            <Button size="sm" asChild>
              <Link href={`/roles/${role.id}/permissions`}>Edit</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {permissions.map((permissionKey) => (
                <Badge key={permissionKey} variant="outline">
                  {permissionKey}
                </Badge>
              ))}
              {permissions.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No permissions assigned.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

import { loginAction } from "@/app/_actions/auth/loginAction";
import { ThemeToggle } from "@/components/ThemeToggle";

const initialState: { error?: string } = {};

export default function LoginComponent() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const isMount = useRef(false);

  useEffect(() => {
    console.log(justRegistered, isMount.current);
    if (justRegistered && !isMount.current) {
      toast.success("Account created", {
        description: "You can now sign in with your credentials.",
      });
    }
    isMount.current = true;
  }, [justRegistered]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary">
              <Package className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">MagnaWMS</CardTitle>
            <CardDescription className="text-balance">
              Sign in to access your warehouse operations
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@magnawms.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

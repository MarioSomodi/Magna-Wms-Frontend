import { NextResponse } from "next/server";
import { logout } from "@/services/authService";
import { cookies } from "next/headers";

export async function GET() {
  await logout();

  const cookieStore = await cookies();
  cookieStore.delete("auth");
  cookieStore.delete("refresh");

  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL),
  );
}

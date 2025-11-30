import LoginComponent from "@/features/authentication/LoginComponent";
import { getCurrentUser } from "@/services/authService";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user.ok) {
    redirect("/warehouses");
  }

  return <LoginComponent />;
}

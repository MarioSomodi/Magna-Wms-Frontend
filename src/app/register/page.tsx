import { getCurrentUser } from "@/services/authService";
import { redirect } from "next/navigation";
import RegisterComponent from "@/features/authentication/RegisterComponents";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user.ok) {
    redirect("/warehouses");
  }

  return <RegisterComponent />;
}

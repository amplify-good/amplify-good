import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect(session.role === "community" ? "/home" : "/dashboard");
  }

  return <LoginForm />;
}

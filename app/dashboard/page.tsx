import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Dashboard from "@/components/ui/Dashboard";

// Force this route to run on every request (no static optimization)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.user) redirect("/");

  return <Dashboard user={session.user} />;
}

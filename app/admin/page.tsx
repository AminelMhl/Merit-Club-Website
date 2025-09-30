import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminDashboard from "@/components/ui/AdminDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.user) redirect("/");

  // Redirect non-admin users to regular dashboard
  if (!session.user.isAdmin) redirect("/dashboard");

  const userData = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    avatar: session.user.avatar,
    department: session.user.department,
    isAdmin: session.user.isAdmin,
  };

  return <AdminDashboard user={userData} />;
}

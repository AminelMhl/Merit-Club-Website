import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Profile from "@/components/ui/Profile";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session.user) redirect("/");

  const userData = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    avatar: session.user.avatar, // ✅ Use actual avatar from session
    points: 0,
    department: session.user.department,
  };

  return <Profile user={userData} />;
}

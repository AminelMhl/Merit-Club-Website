import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { sessionOptions, SessionData } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({
      where: { email },
      include: { department: true },
    });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    );
    session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department?.name,
      avatar: user.avatar,
      points: user.points,
      isAdmin: (user as any).isAdmin,
    };
    await session.save();

    // Redirect based on admin status
    const redirectPath = (user as any).isAdmin ? "/admin" : "/dashboard";
    const res = NextResponse.json({ ok: true, redirectPath });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

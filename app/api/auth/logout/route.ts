import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );
  await session.destroy();
  return res;
}

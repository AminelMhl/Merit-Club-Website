import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();

    if (session.user) {
      return NextResponse.json({ user: session.user });
    } else {
      // Return 200 with null user instead of 401 to reduce console errors
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

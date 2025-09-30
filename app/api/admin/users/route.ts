import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// Get all non-admin users
export async function GET() {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        isAdmin: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        points: true,
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`Found ${users.length} non-admin users`);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

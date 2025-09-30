import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, userId } = await request.json();

    if (!title || !userId) {
      return NextResponse.json(
        { error: "Title and user ID are required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId: parseInt(userId),
        completed: false,
      },
    });

    return NextResponse.json({ task, message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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

    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Message and user ID are required" },
        { status: 400 }
      );
    }

    // Check if user exists first
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notification = await (prisma as any).notification.create({
      data: {
        message,
        userId: parseInt(userId),
      },
    });

    return NextResponse.json({
      notification,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

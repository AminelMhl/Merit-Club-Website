import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// Send notifications to multiple users
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, userIds } = await request.json();

    if (
      !message ||
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Message and valid user IDs are required" },
        { status: 400 }
      );
    }

    // Convert string IDs to numbers
    const userIdNumbers = userIds
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (userIdNumbers.length === 0) {
      return NextResponse.json(
        { error: "No valid user IDs provided" },
        { status: 400 }
      );
    }

    // Verify that all users exist
    const existingUsers = await prisma.user.findMany({
      where: {
        id: { in: userIdNumbers },
        isAdmin: false, // Only send to non-admin users
      },
      select: { id: true, name: true },
    });

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: "No valid users found" },
        { status: 404 }
      );
    }

    // Create notifications for all valid users
    const notifications = existingUsers.map((user) => ({
      message,
      userId: user.id,
      read: false,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return NextResponse.json({
      message: `Notification sent to ${existingUsers.length} user(s) successfully`,
      count: existingUsers.length,
      users: existingUsers.map((u) => u.name),
    });
  } catch (error) {
    console.error("Error sending bulk notifications:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

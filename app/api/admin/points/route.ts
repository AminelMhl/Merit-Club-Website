import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// Add points to a user
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { points, userId } = await request.json();

    if (!points || !userId || points <= 0) {
      return NextResponse.json(
        { error: "Valid points amount and user ID are required" },
        { status: 400 }
      );
    }

    const pointsToAdd = parseInt(points);
    const userIdInt = parseInt(userId);

    if (isNaN(pointsToAdd) || isNaN(userIdInt)) {
      return NextResponse.json(
        { error: "Invalid points or user ID" },
        { status: 400 }
      );
    }

    // Update user points
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt },
      data: {
        points: {
          increment: pointsToAdd,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully added ${pointsToAdd} points to user`,
      newTotal: updatedUser.points,
    });
  } catch (error) {
    console.error("Error adding points:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

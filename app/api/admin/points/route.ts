import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// Update user points (add or subtract)
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { points, userId } = await request.json();

    if (!points || !userId || points === 0) {
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

    // Get current user to check if reduction would result in negative points
    const currentUser = await prisma.user.findUnique({
      where: { id: userIdInt },
      select: { points: true, name: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if point reduction would result in negative points
    if (pointsToAdd < 0 && currentUser.points + pointsToAdd < 0) {
      return NextResponse.json(
        {
          error: `Cannot reduce points below 0. User currently has ${currentUser.points} points.`,
        },
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

    const action = pointsToAdd > 0 ? "added" : "reduced";
    const absolutePoints = Math.abs(pointsToAdd);

    return NextResponse.json({
      message: `Successfully ${action} ${absolutePoints} points ${
        pointsToAdd > 0 ? "to" : "from"
      } ${currentUser.name}`,
      newTotal: updatedUser.points,
      previousTotal: currentUser.points,
    });
  } catch (error) {
    console.error("Error updating points:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

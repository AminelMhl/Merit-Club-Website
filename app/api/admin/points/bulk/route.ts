import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// Update points for multiple users
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { points, userIds } = await request.json();

    if (
      !points ||
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0 ||
      points === 0
    ) {
      return NextResponse.json(
        { error: "Valid points amount and user IDs are required" },
        { status: 400 }
      );
    }

    const pointsToAdd = parseInt(points);

    if (isNaN(pointsToAdd)) {
      return NextResponse.json(
        { error: "Invalid points amount" },
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

    // Get current users to check points for reductions
    const currentUsers = await prisma.user.findMany({
      where: {
        id: { in: userIdNumbers },
        isAdmin: false, // Only update non-admin users
      },
      select: { id: true, name: true, points: true },
    });

    if (currentUsers.length === 0) {
      return NextResponse.json(
        { error: "No valid users found" },
        { status: 404 }
      );
    }

    // Check if any point reduction would result in negative points
    if (pointsToAdd < 0) {
      const usersWithInsufficientPoints = currentUsers.filter(
        (user) => user.points + pointsToAdd < 0
      );

      if (usersWithInsufficientPoints.length > 0) {
        return NextResponse.json(
          {
            error: `Cannot reduce points below 0 for: ${usersWithInsufficientPoints
              .map((u) => u.name)
              .join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Update points for all valid users
    const updatePromises = currentUsers.map((user) =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          points: {
            increment: pointsToAdd,
          },
        },
      })
    );

    const updatedUsers = await Promise.all(updatePromises);

    const action = pointsToAdd > 0 ? "added" : "reduced";
    const absolutePoints = Math.abs(pointsToAdd);

    return NextResponse.json({
      message: `Successfully ${action} ${absolutePoints} points ${
        pointsToAdd > 0 ? "to" : "from"
      } ${updatedUsers.length} user(s)`,
      count: updatedUsers.length,
      users: updatedUsers.map((u) => ({ name: u.name, newTotal: u.points })),
    });
  } catch (error) {
    console.error("Error updating bulk points:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

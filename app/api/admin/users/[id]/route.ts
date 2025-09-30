import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// Delete a user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Don't allow deleting admin users
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if ((userToDelete as any).isAdmin) {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 403 }
      );
    }

    // Delete the user (tasks will be cascade deleted due to schema)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

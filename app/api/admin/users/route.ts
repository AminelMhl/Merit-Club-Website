import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// Get users based on admin role hierarchy
export async function GET() {
  try {
    const session = await getSession();

    if (!session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminRole = session.user.adminRole;
    const adminData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        departmentId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    let users;

    // President, Vice President, and General Secretary see all members (no specific order)
    if (
      adminRole === "president" ||
      adminRole === "vice_president" ||
      adminRole === "general_secretary"
    ) {
      users = await prisma.user.findMany({
        where: {
          isAdmin: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          points: true,
          departmentId: true,
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
    }
    // Department heads see their department members first, then others
    else if (adminRole === "department_head") {
      // Get all non-admin users
      const allUsers = await prisma.user.findMany({
        where: {
          isAdmin: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          points: true,
          departmentId: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      });

      // Sort users: same department first, then others
      const sameDepartmentUsers = allUsers
        .filter((user) => user.departmentId === adminData?.departmentId)
        .sort((a, b) => a.name.localeCompare(b.name));

      const otherDepartmentUsers = allUsers
        .filter((user) => user.departmentId !== adminData?.departmentId)
        .sort((a, b) => a.name.localeCompare(b.name));
      users = [...sameDepartmentUsers, ...otherDepartmentUsers];
    }
    // Fallback for other admin types
    else {
      users = await prisma.user.findMany({
        where: {
          isAdmin: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          points: true,
          departmentId: true,
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
    }

    console.log(
      `Admin ${session.user.name} (${adminRole}) found ${users.length} users`
    );
    return NextResponse.json({
      users,
      adminDepartment: adminData?.department || null,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

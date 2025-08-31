import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const avatarFile = formData.get("avatar") as File | null;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    let avatarPath = null;

    // Handle avatar upload if provided
    if (avatarFile && avatarFile.size > 0) {
      // Validate file type
      if (!avatarFile.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Invalid file type. Please upload an image." },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "File size too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), "public", "uploads", "avatars");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const fileExtension = avatarFile.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExtension}`;
      const filePath = join(uploadsDir, fileName);

      // Save file
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      avatarPath = `/uploads/avatars/${fileName}`;
    }

    // Update user in database
    const updateData: any = {
      name: name.trim(),
    };

    if (avatarPath) {
      updateData.avatar = avatarPath;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Update session with new user data
    session.user = {
      ...session.user,
      name: name.trim(),
      avatar: avatarPath || session.user?.avatar, // Update avatar path if new one uploaded
    };
    await session.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      avatar: avatarPath, // Return the new avatar path
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

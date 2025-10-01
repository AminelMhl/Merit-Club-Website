import prisma from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  // Create departments first
  const hrDept = await prisma.department.upsert({
    where: { name: "Human Recources" },
    create: { name: "Human Recources" },
    update: {},
  });

  const marketingDept = await prisma.department.upsert({
    where: { name: "Marketing" },
    create: { name: "Marketing" },
    update: {},
  });

  const pmDept = await prisma.department.upsert({
    where: { name: "Project Management" },
    create: { name: "Project Management" },
    update: {},
  });

  // Create admin user
  const adminEmail = "admin@merit.tbs";
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: "Admin User",
      isAdmin: true,
      departmentId: hrDept.id,
    },
    update: {
      password: adminPassword,
      name: "Admin User",
      isAdmin: true,
      departmentId: hrDept.id,
    },
  });

  // Create regular users
  const memberEmail = "member@merit.tbs";
  const memberPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: memberEmail },
    create: {
      email: memberEmail,
      password: memberPassword,
      name: "Merit Member",
      isAdmin: false,
      departmentId: hrDept.id,
      points: 50,
    },
    update: {
      password: memberPassword,
      name: "Merit Member",
      isAdmin: false,
      departmentId: hrDept.id,
    },
  });

  const member2Email = "john@merit.tbs";
  const member2Password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: member2Email },
    create: {
      email: member2Email,
      password: member2Password,
      name: "John Doe",
      isAdmin: false,
      departmentId: marketingDept.id,
      points: 75,
    },
    update: {
      password: member2Password,
      name: "John Doe",
      isAdmin: false,
      departmentId: marketingDept.id,
    },
  });

  const member3Email = "jane@merit.tbs";
  const member3Password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: member3Email },
    create: {
      email: member3Email,
      password: member3Password,
      name: "Jane Smith",
      isAdmin: false,
      departmentId: marketingDept.id,
      points: 100,
    },
    update: {
      password: member3Password,
      name: "Jane Smith",
      isAdmin: false,
      departmentId: marketingDept.id,
    },
  });

  // Create sample notifications
  const member1 = await prisma.user.findUnique({
    where: { email: memberEmail },
  });
  const member2 = await prisma.user.findUnique({
    where: { email: member2Email },
  });

  if (member1) {
    await (prisma as any).notification.upsert({
      where: { id: 1 },
      create: {
        message: "Welcome to Merit Club! Check out your first task.",
        userId: member1.id,
        read: false,
      },
      update: {},
    });

    await (prisma as any).notification.upsert({
      where: { id: 2 },
      create: {
        message: "You've been assigned a new project task. Good luck!",
        userId: member1.id,
        read: false,
      },
      update: {},
    });
  }

  if (member2) {
    await (prisma as any).notification.upsert({
      where: { id: 3 },
      create: {
        message: "Great job on completing your last task! Keep it up.",
        userId: member2.id,
        read: false,
      },
      update: {},
    });
  }

  console.log("Seeded users:");
  console.log("Admin:", adminEmail, "password: admin123");
  console.log("Member:", memberEmail, "password: password123");
  console.log("Member:", member2Email, "password: password123");
  console.log("Member:", member3Email, "password: password123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

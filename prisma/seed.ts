import prisma from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  // Create departments first
  const techDept = await prisma.department.upsert({
    where: { name: "Technology" },
    create: { name: "Technology" },
    update: {},
  });

  const marketingDept = await prisma.department.upsert({
    where: { name: "Marketing" },
    create: { name: "Marketing" },
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
      departmentId: techDept.id,
    },
    update: {
      password: adminPassword,
      name: "Admin User",
      isAdmin: true,
      departmentId: techDept.id,
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
      departmentId: techDept.id,
      points: 50,
    },
    update: {
      password: memberPassword,
      name: "Merit Member",
      isAdmin: false,
      departmentId: techDept.id,
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

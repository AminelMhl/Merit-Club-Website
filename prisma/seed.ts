import prisma from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  // Create departments first
  const hrDept = await prisma.department.upsert({
    where: { name: "Human Resources" },
    create: { name: "Human Resources" },
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

  const erDept = await prisma.department.upsert({
    where: { name: "External Relations" },
    create: { name: "External Relations" },
    update: {},
  });

  const prDept = await prisma.department.upsert({
    where: { name: "Public Relations" },
    create: { name: "Public Relations" },
    update: {},
  });

  // Create admin users with different roles
  const presidentEmail = "president@merit.tbs";
  const presidentPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: presidentEmail },
    create: {
      email: presidentEmail,
      password: presidentPassword,
      name: "Club President",
      isAdmin: true,
      adminRole: "president",
      departmentId: hrDept.id,
      points: 500,
    },
    update: {
      password: presidentPassword,
      name: "Club President",
      isAdmin: true,
      adminRole: "president",
      departmentId: hrDept.id,
    },
  });

  const vpEmail = "vp@merit.tbs";
  const vpPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: vpEmail },
    create: {
      email: vpEmail,
      password: vpPassword,
      name: "Vice President",
      isAdmin: true,
      adminRole: "vice_president",
      departmentId: hrDept.id,
      points: 400,
    },
    update: {
      password: vpPassword,
      name: "Vice President",
      isAdmin: true,
      adminRole: "vice_president",
      departmentId: hrDept.id,
    },
  });

  const gsEmail = "gs@merit.tbs";
  const gsPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: gsEmail },
    create: {
      email: gsEmail,
      password: gsPassword,
      name: "General Secretary",
      isAdmin: true,
      adminRole: "general_secretary",
      departmentId: hrDept.id,
      points: 350,
    },
    update: {
      password: gsPassword,
      name: "General Secretary",
      isAdmin: true,
      adminRole: "general_secretary",
      departmentId: hrDept.id,
    },
  });

  // Create department head admins
  const marketingHeadEmail = "marketing.head@merit.tbs";
  const marketingHeadPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: marketingHeadEmail },
    create: {
      email: marketingHeadEmail,
      password: marketingHeadPassword,
      name: "Marketing Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: marketingDept.id,
      points: 300,
    },
    update: {
      password: marketingHeadPassword,
      name: "Marketing Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: marketingDept.id,
    },
  });

  const pmHeadEmail = "pm.head@merit.tbs";
  const pmHeadPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: pmHeadEmail },
    create: {
      email: pmHeadEmail,
      password: pmHeadPassword,
      name: "PM Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: pmDept.id,
      points: 280,
    },
    update: {
      password: pmHeadPassword,
      name: "PM Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: pmDept.id,
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
  console.log("President:", presidentEmail, "password: admin123");
  console.log("Vice President:", vpEmail, "password: admin123");
  console.log("General Secretary:", gsEmail, "password: admin123");
  console.log("Marketing Head:", marketingHeadEmail, "password: admin123");
  console.log("PM Head:", pmHeadEmail, "password: admin123");
  console.log("Member:", memberEmail, "password: password123");
  console.log("Member:", member2Email, "password: password123");
  console.log("Member:", member3Email, "password: password123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

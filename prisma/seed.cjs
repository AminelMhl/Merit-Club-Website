const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

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

  const erHeadEmail = "er.head@merit.tbs";
  const erHeadPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: erHeadEmail },
    create: {
      email: erHeadEmail,
      password: erHeadPassword,
      name: "ER Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: erDept.id,
      points: 260,
    },
    update: {
      password: erHeadPassword,
      name: "ER Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: erDept.id,
    },
  });

  const prHeadEmail = "pr.head@merit.tbs";
  const prHeadPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: prHeadEmail },
    create: {
      email: prHeadEmail,
      password: prHeadPassword,
      name: "PR Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: prDept.id,
      points: 240,
    },
    update: {
      password: prHeadPassword,
      name: "PR Head",
      isAdmin: true,
      adminRole: "department_head",
      departmentId: prDept.id,
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

  // Add members to other departments
  const sarahEmail = "sarah@merit.tbs";
  const sarahPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: sarahEmail },
    create: {
      email: sarahEmail,
      password: sarahPassword,
      name: "Sarah Wilson",
      isAdmin: false,
      departmentId: pmDept.id,
      points: 85,
    },
    update: {
      password: sarahPassword,
      name: "Sarah Wilson",
      isAdmin: false,
      departmentId: pmDept.id,
    },
  });

  const mikeEmail = "mike@merit.tbs";
  const mikePassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: mikeEmail },
    create: {
      email: mikeEmail,
      password: mikePassword,
      name: "Mike Chen",
      isAdmin: false,
      departmentId: erDept.id,
      points: 65,
    },
    update: {
      password: mikePassword,
      name: "Mike Chen",
      isAdmin: false,
      departmentId: erDept.id,
    },
  });

  const emilyEmail = "emily@merit.tbs";
  const emilyPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: emilyEmail },
    create: {
      email: emilyEmail,
      password: emilyPassword,
      name: "Emily Davis",
      isAdmin: false,
      departmentId: prDept.id,
      points: 90,
    },
    update: {
      password: emilyPassword,
      name: "Emily Davis",
      isAdmin: false,
      departmentId: prDept.id,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n🏆 ADMIN USERS:");
  console.log("President:", presidentEmail, "password: admin123");
  console.log("Vice President:", vpEmail, "password: admin123");
  console.log("General Secretary:", gsEmail, "password: admin123");
  console.log("Marketing Head:", marketingHeadEmail, "password: admin123");
  console.log("PM Head:", pmHeadEmail, "password: admin123");
  console.log("ER Head:", erHeadEmail, "password: admin123");
  console.log("PR Head:", prHeadEmail, "password: admin123");
  console.log("\n👤 REGULAR MEMBERS:");
  console.log("Member:", memberEmail, "password: password123");
  console.log("John:", member2Email, "password: password123");
  console.log("Jane:", member3Email, "password: password123");
  console.log("Sarah:", sarahEmail, "password: password123");
  console.log("Mike:", mikeEmail, "password: password123");
  console.log("Emily:", emilyEmail, "password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
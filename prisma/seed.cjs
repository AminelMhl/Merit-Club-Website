// Simple CJS seed script to avoid ESM loader issues
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "member@merit.tbs";
  const password = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email },
    create: { email, password, name: "Merit Member" },
    update: { password },
  });
  console.log("Seeded user:", email, "password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

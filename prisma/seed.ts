import prisma from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = "member@merit.tbs";
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      password,
      name: "Merit Member",
    },
    update: {
      password,
      name: "Merit Member",
    },
  });

  console.log("Seeded user:", email, "password: password123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

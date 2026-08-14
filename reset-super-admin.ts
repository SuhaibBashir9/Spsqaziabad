import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

config({ path: ".env.local" });

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const rl = createInterface({ input, output });

async function main() {
  const password = await rl.question(
    "Enter a NEW Super Admin password: ",
  );

  if (password.length < 8) {
    throw new Error(
      "Password must be at least 8 characters.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({
    where: {
      email: "sadmin@spsqaziabad.com",
    },
    data: {
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      schoolId: null,
    },
    select: {
      email: true,
      role: true,
      status: true,
      schoolId: true,
    },
  });

  console.log("");
  console.log("Super Admin password reset successfully.");
  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
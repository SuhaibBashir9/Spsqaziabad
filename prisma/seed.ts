import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });

const databaseUrl = process.env.DIRECT_URL;

if (!databaseUrl) {
  throw new Error("DIRECT_URL is missing from .env.local");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD is missing from .env.local",
    );
  }

  const adminPasswordHash = bcrypt.hashSync(adminPassword, 12);

  // Create / find the school
  const school = await prisma.school.upsert({
    where: {
      slug: "sps-qaziabad",
    },
    update: {},
    create: {
      name: "SPS Qaziabad",
      slug: "sps-qaziabad",
      email: "admin@sps-qaziabad.local",
      country: "India",
    },
  });

  // Create / update School Admin
  const schoolAdmin = await prisma.user.upsert({
    where: {
      email: "admin@sps-qaziabad.local",
    },
    update: {
      passwordHash: adminPasswordHash,
      name: "School Administrator",
      role: "SCHOOL_ADMIN",
      status: "ACTIVE",
      schoolId: school.id,
    },
    create: {
      name: "School Administrator",
      email: "admin@sps-qaziabad.local",
      passwordHash: adminPasswordHash,
      role: "SCHOOL_ADMIN",
      status: "ACTIVE",
      schoolId: school.id,
    },
  });

  console.log("School:", school.name);
  console.log("School Admin:", schoolAdmin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

  const superAdminPassword =
    process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (!superAdminPassword) {
    throw new Error(
      "SEED_SUPER_ADMIN_PASSWORD is missing from .env.local",
    );
  }

  const schoolAdminPasswordHash =
    bcrypt.hashSync(adminPassword, 12);

  const superAdminPasswordHash =
    bcrypt.hashSync(superAdminPassword, 12);

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

  // Create / update Super Admin
  const superAdmin = await prisma.user.upsert({
    where: {
      email: "sadmin@spsqaziabad.com",
    },
    update: {
      passwordHash: superAdminPasswordHash,
      name: "Super Administrator",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      schoolId: null,
    },
    create: {
      name: "Super Administrator",
      email: "sadmin@spsqaziabad.com",
      passwordHash: superAdminPasswordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      schoolId: null,
    },
  });

  // Create / update School Admin
  const schoolAdmin = await prisma.user.upsert({
    where: {
      email: "admin@sps-qaziabad.local",
    },
    update: {
      passwordHash: schoolAdminPasswordHash,
      name: "School Administrator",
      role: "SCHOOL_ADMIN",
      status: "ACTIVE",
      schoolId: school.id,
    },
    create: {
      name: "School Administrator",
      email: "admin@sps-qaziabad.local",
      passwordHash: schoolAdminPasswordHash,
      role: "SCHOOL_ADMIN",
      status: "ACTIVE",
      schoolId: school.id,
    },
  });

  console.log("School:", school.name);
  console.log("Super Admin:", superAdmin.email);
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
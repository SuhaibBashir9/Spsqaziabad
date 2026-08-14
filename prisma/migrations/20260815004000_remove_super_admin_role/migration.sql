-- Convert any existing Super Admin accounts to the remaining school-admin role.
UPDATE "User"
SET "role" = 'SCHOOL_ADMIN'
WHERE "role" = 'SUPER_ADMIN';

-- PostgreSQL does not support dropping an enum value directly, so rebuild the enum.
CREATE TYPE "UserRole_new" AS ENUM ('SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT');

ALTER TABLE "User"
ALTER COLUMN "role" TYPE "UserRole_new"
USING ("role"::text::"UserRole_new");

DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

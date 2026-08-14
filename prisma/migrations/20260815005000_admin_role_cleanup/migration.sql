BEGIN;

CREATE TYPE "UserRole_new" AS ENUM (
  'ADMIN',
  'TEACHER',
  'STUDENT'
);

ALTER TABLE "User"
  ALTER COLUMN "role" TYPE "UserRole_new"
  USING (
    CASE
      WHEN "role"::text = 'SCHOOL_ADMIN' THEN 'ADMIN'
      WHEN "role"::text = 'TEACHER' THEN 'TEACHER'
      WHEN "role"::text = 'STUDENT' THEN 'STUDENT'
      ELSE NULL
    END
  )::"UserRole_new";

DROP TYPE "UserRole";

ALTER TYPE "UserRole_new" RENAME TO "UserRole";

COMMIT;

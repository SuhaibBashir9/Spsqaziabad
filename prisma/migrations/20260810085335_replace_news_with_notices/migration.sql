/*
  Warnings:

  - You are about to drop the `NewsPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NewsPost" DROP CONSTRAINT "NewsPost_schoolId_fkey";

-- DropTable
DROP TABLE "NewsPost";

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "attachmentUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notice_schoolId_idx" ON "Notice"("schoolId");

-- CreateIndex
CREATE INDEX "Notice_published_idx" ON "Notice"("published");

-- CreateIndex
CREATE INDEX "Notice_publishedAt_idx" ON "Notice"("publishedAt");

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

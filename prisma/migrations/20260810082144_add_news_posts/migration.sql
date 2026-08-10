-- CreateTable
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'School News',
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsPost_schoolId_idx" ON "NewsPost"("schoolId");

-- CreateIndex
CREATE INDEX "NewsPost_published_idx" ON "NewsPost"("published");

-- CreateIndex
CREATE INDEX "NewsPost_publishedAt_idx" ON "NewsPost"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_schoolId_slug_key" ON "NewsPost"("schoolId", "slug");

-- AddForeignKey
ALTER TABLE "NewsPost" ADD CONSTRAINT "NewsPost_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

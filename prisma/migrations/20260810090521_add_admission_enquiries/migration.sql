-- CreateTable
CREATE TABLE "AdmissionEnquiry" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "className" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdmissionEnquiry_schoolId_idx" ON "AdmissionEnquiry"("schoolId");

-- CreateIndex
CREATE INDEX "AdmissionEnquiry_status_idx" ON "AdmissionEnquiry"("status");

-- CreateIndex
CREATE INDEX "AdmissionEnquiry_createdAt_idx" ON "AdmissionEnquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "AdmissionEnquiry" ADD CONSTRAINT "AdmissionEnquiry_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

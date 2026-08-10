/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,phone]` on the table `AdmissionEnquiry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdmissionEnquiry_schoolId_phone_key" ON "AdmissionEnquiry"("schoolId", "phone");

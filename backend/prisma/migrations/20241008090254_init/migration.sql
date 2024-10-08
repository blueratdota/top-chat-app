/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `GeneralInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GeneralInfo_profileId_key" ON "GeneralInfo"("profileId");

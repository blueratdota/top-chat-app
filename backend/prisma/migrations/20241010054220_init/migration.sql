/*
  Warnings:

  - You are about to drop the column `birthOPlace` on the `GeneralInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GeneralInfo" DROP COLUMN "birthOPlace",
ADD COLUMN     "birthPlace" TEXT;

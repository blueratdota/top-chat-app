/*
  Warnings:

  - You are about to drop the column `authorId` on the `GeneralInfo` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `GeneralInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GeneralInfo" DROP CONSTRAINT "GeneralInfo_authorId_fkey";

-- AlterTable
ALTER TABLE "GeneralInfo" DROP COLUMN "authorId",
DROP COLUMN "type",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthOPlace" TEXT,
ADD COLUMN     "college" TEXT,
ADD COLUMN     "collegeDegree" TEXT,
ADD COLUMN     "highschool" TEXT,
ADD COLUMN     "residence" TEXT,
ADD COLUMN     "workCompany" TEXT,
ADD COLUMN     "workPosition" TEXT;

-- DropEnum
DROP TYPE "GeneralInfoType";

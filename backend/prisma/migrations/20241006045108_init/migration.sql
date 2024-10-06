/*
  Warnings:

  - You are about to drop the column `acceptingUserrId` on the `Friendship` table. All the data in the column will be lost.
  - Added the required column `acceptingUserId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_acceptingUserrId_fkey";

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "acceptingUserrId",
ADD COLUMN     "acceptingUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_acceptingUserId_fkey" FOREIGN KEY ("acceptingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

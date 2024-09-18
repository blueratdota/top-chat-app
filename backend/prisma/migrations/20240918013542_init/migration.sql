/*
  Warnings:

  - You are about to drop the column `userId` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `acceptingUserId` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestingUserId` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_userId_fkey";

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "userId",
ADD COLUMN     "acceptingUserId" TEXT NOT NULL,
ADD COLUMN     "requestingUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_requestingUserId_fkey" FOREIGN KEY ("requestingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_acceptingUserId_fkey" FOREIGN KEY ("acceptingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

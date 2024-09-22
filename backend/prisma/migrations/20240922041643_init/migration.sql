/*
  Warnings:

  - You are about to drop the `_Friends List` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `acceptingUserrId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Friends List" DROP CONSTRAINT "_Friends List_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friends List" DROP CONSTRAINT "_Friends List_B_fkey";

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "acceptingUserrId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_Friends List";

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_acceptingUserrId_fkey" FOREIGN KEY ("acceptingUserrId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

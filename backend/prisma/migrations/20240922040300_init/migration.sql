/*
  Warnings:

  - You are about to drop the `_FriendshipToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `requestingUserId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FriendshipToUser" DROP CONSTRAINT "_FriendshipToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FriendshipToUser" DROP CONSTRAINT "_FriendshipToUser_B_fkey";

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "requestingUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_FriendshipToUser";

-- CreateTable
CREATE TABLE "_Friends List" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Friends List_AB_unique" ON "_Friends List"("A", "B");

-- CreateIndex
CREATE INDEX "_Friends List_B_index" ON "_Friends List"("B");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requestingUserId_fkey" FOREIGN KEY ("requestingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friends List" ADD CONSTRAINT "_Friends List_A_fkey" FOREIGN KEY ("A") REFERENCES "Friendship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friends List" ADD CONSTRAINT "_Friends List_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

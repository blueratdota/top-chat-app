/*
  Warnings:

  - You are about to drop the column `privateConversationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_privateConversationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "privateConversationId",
ADD COLUMN     "conversationId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

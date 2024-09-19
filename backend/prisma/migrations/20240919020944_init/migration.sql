/*
  Warnings:

  - You are about to drop the column `conversationId` on the `User` table. All the data in the column will be lost.
  - Added the required column `dateUpdated` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('PRIVATE', 'GROUP');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_conversationId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "dateUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "ConversationType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "conversationId",
ADD COLUMN     "privateConversationId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_privateConversationId_fkey" FOREIGN KEY ("privateConversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `dateAccepted` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "dateAccepted" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

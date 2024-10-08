-- CreateEnum
CREATE TYPE "GeneralInfoType" AS ENUM ('EDUCATION', 'ADDRESS', 'ORIGIN', 'BIRTH_DATE');

-- CreateTable
CREATE TABLE "GeneralInfo" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" "GeneralInfoType" NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "GeneralInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneralInfo" ADD CONSTRAINT "GeneralInfo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralInfo" ADD CONSTRAINT "GeneralInfo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

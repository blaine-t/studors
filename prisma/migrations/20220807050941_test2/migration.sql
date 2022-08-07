/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tutor` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Tutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Tutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefGrade` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_time_idx";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Session_id_seq";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tutor" DROP COLUMN "name",
ADD COLUMN     "availability" TIMESTAMP(3)[],
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "prefGrade" INTEGER NOT NULL,
ADD COLUMN     "subjects" TEXT[];

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authKey" TEXT NOT NULL,
    "darkMode" BOOLEAN NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_authKey_key" ON "Admin"("authKey");

-- CreateIndex
CREATE INDEX "Session_time_tutorId_studentId_idx" ON "Session"("time", "tutorId", "studentId");

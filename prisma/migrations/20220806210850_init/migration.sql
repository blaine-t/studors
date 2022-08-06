/*
  Warnings:

  - You are about to drop the `Students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tutors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Students";

-- DropTable
DROP TABLE "Tutors";

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "phone" INTEGER,
    "email" TEXT,
    "authKey" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "darkMode" BOOLEAN NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "phone" INTEGER,
    "email" TEXT,
    "authKey" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "darkMode" BOOLEAN NOT NULL,
    "hoursTerm" DOUBLE PRECISION NOT NULL,
    "hoursTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "tutorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_authKey_key" ON "Student"("authKey");

-- CreateIndex
CREATE INDEX "Student_authKey_idx" ON "Student"("authKey");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_authKey_key" ON "Tutor"("authKey");

-- CreateIndex
CREATE INDEX "Tutor_authKey_idx" ON "Tutor"("authKey");

-- CreateIndex
CREATE INDEX "Session_time_idx" ON "Session"("time");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

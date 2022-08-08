-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authKey" TEXT NOT NULL,
    "darkMode" BOOLEAN NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "authKey" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "darkMode" BOOLEAN NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "authKey" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "subjects" TEXT[],
    "availability" TIMESTAMP(3)[],
    "darkMode" BOOLEAN NOT NULL,
    "hoursTerm" DOUBLE PRECISION NOT NULL,
    "hoursTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "tutorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_authKey_key" ON "Admin"("authKey");

-- CreateIndex
CREATE INDEX "Admin_authKey_idx" ON "Admin"("authKey");

-- CreateIndex
CREATE UNIQUE INDEX "Student_authKey_key" ON "Student"("authKey");

-- CreateIndex
CREATE INDEX "Student_authKey_idx" ON "Student"("authKey");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_authKey_key" ON "Tutor"("authKey");

-- CreateIndex
CREATE INDEX "Tutor_authKey_idx" ON "Tutor"("authKey");

-- CreateIndex
CREATE INDEX "Session_time_tutorId_studentId_idx" ON "Session"("time", "tutorId", "studentId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

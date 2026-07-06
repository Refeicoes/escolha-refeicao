-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('TERCA', 'QUINTA');

-- CreateEnum
CREATE TYPE "MealEventStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "SelectionOption" AS ENUM ('MASSA', 'STREET_FOOD', 'TRADICIONAL');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealEvent" (
    "id" SERIAL NOT NULL,
    "mealDate" DATE NOT NULL,
    "mealType" "MealType" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "MealEventStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "mealEventId" INTEGER NOT NULL,
    "selection" "SelectionOption" NOT NULL,
    "companyIdAtResponse" INTEGER NOT NULL,
    "fullNameAtResponse" TEXT NOT NULL,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_registrationNumber_key" ON "Employee"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MealEvent_mealDate_key" ON "MealEvent"("mealDate");

-- CreateIndex
CREATE UNIQUE INDEX "Response_employeeId_mealEventId_key" ON "Response"("employeeId", "mealEventId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_mealEventId_fkey" FOREIGN KEY ("mealEventId") REFERENCES "MealEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_companyIdAtResponse_fkey" FOREIGN KEY ("companyIdAtResponse") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

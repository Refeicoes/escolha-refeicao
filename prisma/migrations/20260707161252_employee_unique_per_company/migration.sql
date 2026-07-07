-- DropIndex
DROP INDEX "Employee_registrationNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Employee_registrationNumber_companyId_key" ON "Employee"("registrationNumber", "companyId");

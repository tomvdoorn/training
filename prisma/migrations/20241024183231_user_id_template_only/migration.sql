/*
  Warnings:

  - A unique constraint covering the columns `[planId,day]` on the table `TrainingPlanTemplate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `TrainingPlanTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TrainingPlanTemplate" DROP CONSTRAINT "TrainingPlanTemplate_templateId_fkey";

-- AlterTable
ALTER TABLE "TrainingPlanTemplate" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "templateId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlanTemplate_planId_day_key" ON "TrainingPlanTemplate"("planId", "day");

-- AddForeignKey
ALTER TABLE "TrainingPlanTemplate" ADD CONSTRAINT "TrainingPlanTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanTemplate" ADD CONSTRAINT "TrainingPlanTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


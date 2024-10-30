/*
  Warnings:

  - You are about to drop the column `gripId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the `ExerciseGrip` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_gripId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "gripId";

-- DropTable
DROP TABLE "ExerciseGrip";

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

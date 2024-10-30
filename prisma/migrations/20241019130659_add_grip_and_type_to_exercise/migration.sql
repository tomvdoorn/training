/*
  Warnings:

  - You are about to drop the column `type` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `gripId` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PRType" AS ENUM ('HighestWeight', 'HighestVolume', 'HighestOneRepMax');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "type",
ADD COLUMN     "gripId" INTEGER NOT NULL,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SessionExerciseSet" ALTER COLUMN "reps" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TemplateExercise" ADD COLUMN     "notes" TEXT;

-- CreateTable
CREATE TABLE "ExerciseGrip" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExerciseGrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExerciseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercisePersonalRecord" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionExerciseId" INTEGER NOT NULL,
    "setId" INTEGER NOT NULL,
    "prType" "PRType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExercisePersonalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseGrip_name_key" ON "ExerciseGrip"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseType_name_key" ON "ExerciseType"("name");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ExerciseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_gripId_fkey" FOREIGN KEY ("gripId") REFERENCES "ExerciseGrip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisePersonalRecord" ADD CONSTRAINT "ExercisePersonalRecord_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisePersonalRecord" ADD CONSTRAINT "ExercisePersonalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisePersonalRecord" ADD CONSTRAINT "ExercisePersonalRecord_sessionExerciseId_fkey" FOREIGN KEY ("sessionExerciseId") REFERENCES "SessionExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisePersonalRecord" ADD CONSTRAINT "ExercisePersonalRecord_setId_fkey" FOREIGN KEY ("setId") REFERENCES "SessionExerciseSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

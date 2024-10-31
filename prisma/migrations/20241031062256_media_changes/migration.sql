/*
  Warnings:

  - A unique constraint covering the columns `[user_id,template_id]` on the table `Acquisition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,training_plan_id]` on the table `Acquisition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SessionExerciseMedia" ADD COLUMN     "postId" INTEGER;

-- AlterTable
ALTER TABLE "TrainingSession" ADD COLUMN     "rating" INTEGER;

-- CreateTable
CREATE TABLE "ExerciseMedia" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sessionExerciseId" INTEGER NOT NULL,
    "setIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
/* CREATE UNIQUE INDEX "Acquisition_user_id_template_id_key" ON "Acquisition"("user_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "Acquisition_user_id_training_plan_id_key" ON "Acquisition"("user_id", "training_plan_id"); */

-- AddForeignKey
ALTER TABLE "SessionExerciseMedia" ADD CONSTRAINT "SessionExerciseMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseMedia" ADD CONSTRAINT "ExerciseMedia_sessionExerciseId_fkey" FOREIGN KEY ("sessionExerciseId") REFERENCES "SessionExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

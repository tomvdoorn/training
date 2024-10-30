/*
  Warnings:

  - A unique constraint covering the columns `[user_id,template_id]` on the table `Acquisition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,training_plan_id]` on the table `Acquisition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TrainingPlanDifficulty" AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');

-- AlterTable
ALTER TABLE "TrainingPlan" ADD COLUMN     "difficulty" "TrainingPlanDifficulty" NOT NULL DEFAULT 'Beginner';

-- First drop all existing indexes
DROP INDEX IF EXISTS "Acquisition_user_id_template_id_key";
DROP INDEX IF EXISTS "Acquisition_user_id_training_plan_id_key";
DROP INDEX IF EXISTS "StoreListing_template_id_key";
DROP INDEX IF EXISTS "StoreListing_training_plan_id_key";

-- Then create the indexes fresh
CREATE UNIQUE INDEX "Acquisition_user_id_template_id_key" ON "Acquisition"("user_id", "template_id") 
    WHERE template_id IS NOT NULL;
CREATE UNIQUE INDEX "Acquisition_user_id_training_plan_id_key" ON "Acquisition"("user_id", "training_plan_id") 
    WHERE training_plan_id IS NOT NULL;
CREATE UNIQUE INDEX "StoreListing_template_id_key" ON "StoreListing"("template_id");
CREATE UNIQUE INDEX "StoreListing_training_plan_id_key" ON "StoreListing"("training_plan_id");

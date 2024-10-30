/*
  Warnings:

  - Added the required column `duration` to the `TrainingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingPlan" ADD COLUMN     "duration" INTEGER NOT NULL;

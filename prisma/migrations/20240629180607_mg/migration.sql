/*
  Warnings:

  - The `muscleGroup` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `SessionExerciseSet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `TemplateExerciseSet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('Legs', 'Chest', 'Back', 'Shoulders', 'Hamstrings', 'Calves', 'Lats', 'Triceps', 'Biceps');

-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('Warmup', 'Regular', 'Dropset', 'Superset', 'Partials');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "muscleGroup",
ADD COLUMN     "muscleGroup" "MuscleGroup";

-- AlterTable
ALTER TABLE "SessionExerciseSet" DROP COLUMN "type",
ADD COLUMN     "type" "SetType" NOT NULL;

-- AlterTable
ALTER TABLE "TemplateExerciseSet" DROP COLUMN "type",
ADD COLUMN     "type" "SetType" NOT NULL;

-- DropTable
DROP TABLE "Post";

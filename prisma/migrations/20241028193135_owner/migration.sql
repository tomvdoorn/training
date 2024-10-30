/*
  Warnings:

  - Added the required column `owner_id` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `TrainingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- First, drop any existing constraints and indexes that might conflict
DO $$ BEGIN
    ALTER TABLE IF EXISTS "Template" DROP CONSTRAINT IF EXISTS "Template_owner_id_fkey";
    ALTER TABLE IF EXISTS "Template" DROP CONSTRAINT IF EXISTS "Template_original_id_fkey";
    ALTER TABLE IF EXISTS "TrainingPlan" DROP CONSTRAINT IF EXISTS "TrainingPlan_owner_id_fkey";
    ALTER TABLE IF EXISTS "TrainingPlan" DROP CONSTRAINT IF EXISTS "TrainingPlan_original_id_fkey";
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

-- Drop existing indexes if they exist
DO $$ BEGIN
    DROP INDEX IF EXISTS "StoreListing_template_id_key";
    DROP INDEX IF EXISTS "StoreListing_training_plan_id_key";
    DROP INDEX IF EXISTS "Acquisition_user_id_template_id_key";
    DROP INDEX IF EXISTS "Acquisition_user_id_training_plan_id_key";
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "Acquisition";
DROP TABLE IF EXISTS "StoreListing";

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "StoreStatus" AS ENUM ('Active', 'Inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ListingType" AS ENUM ('Template', 'TrainingPlan');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable: First add nullable columns
ALTER TABLE "Template" 
ADD COLUMN IF NOT EXISTS "is_copy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "original_id" INTEGER,
ADD COLUMN IF NOT EXISTS "owner_id" TEXT;

ALTER TABLE "TrainingPlan" 
ADD COLUMN IF NOT EXISTS "is_copy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "original_id" INTEGER,
ADD COLUMN IF NOT EXISTS "owner_id" TEXT;

-- Update existing records
UPDATE "Template" SET "owner_id" = "userId" WHERE "owner_id" IS NULL;
UPDATE "TrainingPlan" SET "owner_id" = "userId" WHERE "owner_id" IS NULL;

-- Make owner_id required
ALTER TABLE "Template" ALTER COLUMN "owner_id" SET NOT NULL;
ALTER TABLE "TrainingPlan" ALTER COLUMN "owner_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "StoreListing" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preview_image" TEXT,
    "purchase_count" INTEGER NOT NULL DEFAULT 0,
    "status" "StoreStatus" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "ListingType" NOT NULL,
    "template_id" INTEGER,
    "training_plan_id" INTEGER,

    CONSTRAINT "StoreListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acquisition" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "template_id" INTEGER,
    "training_plan_id" INTEGER,
    "acquired_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Acquisition_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX IF NOT EXISTS "StoreListing_template_id_key" ON "StoreListing"("template_id");
CREATE UNIQUE INDEX IF NOT EXISTS "StoreListing_training_plan_id_key" ON "StoreListing"("training_plan_id");
CREATE UNIQUE INDEX IF NOT EXISTS "Acquisition_user_id_template_id_key" ON "Acquisition"("user_id", "template_id") 
    WHERE template_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Acquisition_user_id_training_plan_id_key" ON "Acquisition"("user_id", "training_plan_id") 
    WHERE training_plan_id IS NOT NULL;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_owner_id_fkey" 
    FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Template" ADD CONSTRAINT "Template_original_id_fkey" 
    FOREIGN KEY ("original_id") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_owner_id_fkey" 
    FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_original_id_fkey" 
    FOREIGN KEY ("original_id") REFERENCES "TrainingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StoreListing" ADD CONSTRAINT "StoreListing_template_id_fkey" 
    FOREIGN KEY ("template_id") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StoreListing" ADD CONSTRAINT "StoreListing_training_plan_id_fkey" 
    FOREIGN KEY ("training_plan_id") REFERENCES "TrainingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Acquisition" ADD CONSTRAINT "Acquisition_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Acquisition" ADD CONSTRAINT "Acquisition_template_id_fkey" 
    FOREIGN KEY ("template_id") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Acquisition" ADD CONSTRAINT "Acquisition_training_plan_id_fkey" 
    FOREIGN KEY ("training_plan_id") REFERENCES "TrainingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

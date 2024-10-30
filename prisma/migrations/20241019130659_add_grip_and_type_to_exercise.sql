-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "typeId" INTEGER;

-- Update existing records
UPDATE "Exercise" SET "typeId" = 1 WHERE "typeId" IS NULL;

-- Make typeId NOT NULL after updating existing records
ALTER TABLE "Exercise" ALTER COLUMN "typeId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Exercise_typeId_idx" ON "Exercise"("typeId");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ExerciseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

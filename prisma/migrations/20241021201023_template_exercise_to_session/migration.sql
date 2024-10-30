-- AlterTable
ALTER TABLE "SessionExercise" ADD COLUMN     "templateExerciseId" INTEGER;

-- AlterTable
ALTER TABLE "SessionExerciseSet" ADD COLUMN     "templateExerciseSetId" INTEGER;

-- AddForeignKey
ALTER TABLE "SessionExercise" ADD CONSTRAINT "SessionExercise_templateExerciseId_fkey" FOREIGN KEY ("templateExerciseId") REFERENCES "TemplateExercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionExerciseSet" ADD CONSTRAINT "SessionExerciseSet_templateExerciseSetId_fkey" FOREIGN KEY ("templateExerciseSetId") REFERENCES "TemplateExerciseSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

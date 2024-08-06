-- DropForeignKey
ALTER TABLE "TemplateExercise" DROP CONSTRAINT "TemplateExercise_templateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateExerciseSet" DROP CONSTRAINT "TemplateExerciseSet_templateExerciseId_fkey";

-- AddForeignKey
ALTER TABLE "TemplateExercise" ADD CONSTRAINT "TemplateExercise_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateExerciseSet" ADD CONSTRAINT "TemplateExerciseSet_templateExerciseId_fkey" FOREIGN KEY ("templateExerciseId") REFERENCES "TemplateExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

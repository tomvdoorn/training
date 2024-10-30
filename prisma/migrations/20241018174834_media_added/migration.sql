-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "note" TEXT;

-- CreateTable
CREATE TABLE "TrainingSessionMedia" (
    "id" SERIAL NOT NULL,
    "trainingSessionId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingSessionMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionExerciseMedia" (
    "id" SERIAL NOT NULL,
    "sessionExerciseId" INTEGER NOT NULL,
    "setIds" INTEGER[],
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionExerciseMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingSessionMedia" ADD CONSTRAINT "TrainingSessionMedia_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "TrainingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionExerciseMedia" ADD CONSTRAINT "SessionExerciseMedia_sessionExerciseId_fkey" FOREIGN KEY ("sessionExerciseId") REFERENCES "SessionExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

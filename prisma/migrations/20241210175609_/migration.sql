/*
  Warnings:

  - You are about to drop the column `setIds` on the `Media` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "setIds",
ADD COLUMN     "sessionExerciseSetId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_sessionExerciseSetId_fkey" FOREIGN KEY ("sessionExerciseSetId") REFERENCES "SessionExerciseSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

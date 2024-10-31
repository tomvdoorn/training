/*
  Warnings:

  - A unique constraint covering the columns `[user_id,template_id]` on the table `Acquisition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,training_plan_id]` on the table `Acquisition` will be added. If there are existing duplicate values, this will fail.

*/

DROP INDEX IF EXISTS "Acquisition_user_id_template_id_key";
DROP INDEX IF EXISTS "Acquisition_user_id_training_plan_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Acquisition_user_id_template_id_key" ON "Acquisition"("user_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "Acquisition_user_id_training_plan_id_key" ON "Acquisition"("user_id", "training_plan_id");

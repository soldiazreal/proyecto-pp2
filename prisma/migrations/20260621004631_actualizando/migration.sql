/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `Mesa` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Plato" ALTER COLUMN "codigo" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Mesa_numero_key" ON "Mesa"("numero");

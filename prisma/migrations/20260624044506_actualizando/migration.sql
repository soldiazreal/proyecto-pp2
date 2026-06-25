/*
  Warnings:

  - Added the required column `disponibilidad` to the `Plato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gluten` to the `Plato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plato" ADD COLUMN     "disponibilidad" BOOLEAN NOT NULL,
ADD COLUMN     "gluten" BOOLEAN NOT NULL;

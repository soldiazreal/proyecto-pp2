/*
  Warnings:

  - You are about to drop the column `disponibilidad` on the `Plato` table. All the data in the column will be lost.
  - You are about to drop the column `gluten` on the `Plato` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plato" DROP COLUMN "disponibilidad",
DROP COLUMN "gluten",
ADD COLUMN     "disponible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sinGluten" BOOLEAN NOT NULL DEFAULT true;

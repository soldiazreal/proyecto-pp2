/*
  Warnings:

  - The `estado` column on the `Mesa` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoMesa" AS ENUM ('Disponible', 'Ocupada', 'Reservada', 'Mantenimiento');

-- AlterTable
ALTER TABLE "Mesa" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoMesa" NOT NULL DEFAULT 'Disponible';

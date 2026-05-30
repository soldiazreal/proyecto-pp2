/*
  Warnings:

  - Added the required column `fechaModificacion` to the `Mesa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mesa" ADD COLUMN     "clientesActuales" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "consumoActual" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "duracionEstimada" INTEGER,
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaModificacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "horaOcupacion" TIMESTAMP(3),
ADD COLUMN     "meseroAsignado" TEXT;

-- CreateTable
CREATE TABLE "Plato" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,

    CONSTRAINT "Plato_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mesa" ADD CONSTRAINT "Mesa_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

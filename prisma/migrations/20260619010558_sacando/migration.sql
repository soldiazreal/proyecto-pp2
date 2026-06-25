-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_platoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "platoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Plato" ALTER COLUMN "precio" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_platoId_fkey" FOREIGN KEY ("platoId") REFERENCES "Plato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

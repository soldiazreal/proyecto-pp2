-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_platoId_fkey";

-- AlterTable
ALTER TABLE "Plato" ADD COLUMN     "pedidoId" INTEGER;

-- AddForeignKey
ALTER TABLE "Plato" ADD CONSTRAINT "Plato_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

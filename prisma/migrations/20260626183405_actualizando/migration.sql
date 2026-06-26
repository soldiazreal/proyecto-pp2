/*
  Warnings:

  - You are about to drop the column `platoId` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `pedidoId` on the `Plato` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plato" DROP CONSTRAINT "Plato_pedidoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "platoId";

-- AlterTable
ALTER TABLE "Plato" DROP COLUMN "pedidoId";

-- CreateTable
CREATE TABLE "_PedidoToPlato" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PedidoToPlato_AB_unique" ON "_PedidoToPlato"("A", "B");

-- CreateIndex
CREATE INDEX "_PedidoToPlato_B_index" ON "_PedidoToPlato"("B");

-- AddForeignKey
ALTER TABLE "_PedidoToPlato" ADD CONSTRAINT "_PedidoToPlato_A_fkey" FOREIGN KEY ("A") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoToPlato" ADD CONSTRAINT "_PedidoToPlato_B_fkey" FOREIGN KEY ("B") REFERENCES "Plato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

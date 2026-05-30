/*
  Warnings:

  - You are about to drop the column `productos` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Pedido` table. All the data in the column will be lost.
  - Added the required column `platoId` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "productos",
DROP COLUMN "total",
ADD COLUMN     "platoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_platoId_fkey" FOREIGN KEY ("platoId") REFERENCES "Plato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `salonId` on the `Mesa` table. All the data in the column will be lost.
  - You are about to drop the `Salon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mesa" DROP CONSTRAINT "Mesa_salonId_fkey";

-- AlterTable
ALTER TABLE "Mesa" DROP COLUMN "salonId";

-- DropTable
DROP TABLE "Salon";

/*
  Warnings:

  - The `visitorAccountId` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VisitorAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VisitorAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_visitorAccountId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "visitorAccountId",
ADD COLUMN     "visitorAccountId" INTEGER;

-- AlterTable
ALTER TABLE "VisitorAccount" DROP CONSTRAINT "VisitorAccount_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VisitorAccount_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_visitorAccountId_fkey" FOREIGN KEY ("visitorAccountId") REFERENCES "VisitorAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

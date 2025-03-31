/*
  Warnings:

  - The primary key for the `VisitorAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_visitorAccountId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "visitorAccountId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "VisitorAccount" DROP CONSTRAINT "VisitorAccount_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VisitorAccount_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VisitorAccount_id_seq";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_visitorAccountId_fkey" FOREIGN KEY ("visitorAccountId") REFERENCES "VisitorAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - The values [SINGLE] on the enum `RoomType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isAvailable` on the `Room` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Amenity" AS ENUM ('WIFI', 'TV', 'AC', 'MINI_BAR', 'JACUZZI');

-- AlterEnum
ALTER TYPE "RoomStatus" ADD VALUE 'MAINTENANCE';

-- AlterEnum
BEGIN;
CREATE TYPE "RoomType_new" AS ENUM ('STANDARD', 'DELUXE', 'SUITE');
ALTER TABLE "Room" ALTER COLUMN "type" TYPE "RoomType_new" USING ("type"::text::"RoomType_new");
ALTER TABLE "Booking" ALTER COLUMN "roomType" TYPE "RoomType_new" USING ("roomType"::text::"RoomType_new");
ALTER TYPE "RoomType" RENAME TO "RoomType_old";
ALTER TYPE "RoomType_new" RENAME TO "RoomType";
DROP TYPE "RoomType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "isAvailable",
ADD COLUMN     "amenities" "Amenity"[],
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE',
ALTER COLUMN "price" SET DEFAULT 0;

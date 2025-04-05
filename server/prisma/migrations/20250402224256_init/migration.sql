-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('STANDARD', 'DELUXE', 'SUITE');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Amenity" AS ENUM ('WIFI', 'TV', 'AC', 'MINI_BAR', 'JACUZZI');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SUPER_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorAccount" (
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,

    CONSTRAINT "VisitorAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "type" "RoomType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amenities" "Amenity"[],
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "adults" INTEGER NOT NULL,
    "kids" INTEGER NOT NULL,
    "specialRequest" TEXT,
    "roomType" "RoomType" NOT NULL,
    "roomPrice" DOUBLE PRECISION NOT NULL,
    "roomId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorAccountId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorAccount_phone_key" ON "VisitorAccount"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorAccount_email_key" ON "VisitorAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_visitorAccountId_fkey" FOREIGN KEY ("visitorAccountId") REFERENCES "VisitorAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

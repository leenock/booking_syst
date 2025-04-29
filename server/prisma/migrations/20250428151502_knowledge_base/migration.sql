-- AlterEnum
ALTER TYPE "RoomStatus" ADD VALUE 'BOOKED';

-- CreateTable
CREATE TABLE "KnowldgeBase" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowldgeBase_pkey" PRIMARY KEY ("id")
);

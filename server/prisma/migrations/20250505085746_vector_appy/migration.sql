-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "KnowldgeBase" ADD COLUMN     "vector" vector(1024);

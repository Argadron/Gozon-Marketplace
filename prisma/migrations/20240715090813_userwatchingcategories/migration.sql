-- AlterTable
ALTER TABLE "user" ADD COLUMN     "watching_categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "alert" ADD COLUMN     "deleted_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

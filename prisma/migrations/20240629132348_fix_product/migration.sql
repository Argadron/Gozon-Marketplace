/*
  Warnings:

  - You are about to drop the `product_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_product_id_fkey";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "product_categories";

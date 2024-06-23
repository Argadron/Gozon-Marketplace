/*
  Warnings:

  - Added the required column `seller_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "seller_id" INTEGER NOT NULL;

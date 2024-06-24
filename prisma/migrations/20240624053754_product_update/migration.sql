/*
  Warnings:

  - A unique constraint covering the columns `[seller_id]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_seller_id_key" ON "product"("seller_id");

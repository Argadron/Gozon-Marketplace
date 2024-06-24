/*
  Warnings:

  - Added the required column `description` to the `seller_requirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `seller_requirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fio` to the `seller_requirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_company` to the `seller_requirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `seller_requirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seller_requirement" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fio" TEXT NOT NULL,
ADD COLUMN     "is_company" BOOLEAN NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the `black_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "black_list" DROP CONSTRAINT "black_list_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "blackList" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- DropTable
DROP TABLE "black_list";

/*
  Warnings:

  - You are about to drop the column `blackList` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "blackList",
ADD COLUMN     "black_list" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

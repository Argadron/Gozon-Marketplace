/*
  Warnings:

  - The `blocked_id` column on the `black_list` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_id]` on the table `black_list` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "black_list" DROP COLUMN "blocked_id",
ADD COLUMN     "blocked_id" INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "black_list_user_id_key" ON "black_list"("user_id");

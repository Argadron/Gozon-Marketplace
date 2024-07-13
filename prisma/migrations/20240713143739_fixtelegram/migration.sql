/*
  Warnings:

  - You are about to drop the column `auth_token` on the `telegram` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `telegram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegram_id]` on the table `telegram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `telegram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegram_id` to the `telegram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `telegram` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "telegram_auth_token_key";

-- DropIndex
DROP INDEX "telegram_userId_key";

-- AlterTable
ALTER TABLE "telegram" DROP COLUMN "auth_token",
DROP COLUMN "userId",
ADD COLUMN     "telegram_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "telegram_auth" (
    "id" SERIAL NOT NULL,
    "auth_token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_auth_auth_token_key" ON "telegram_auth"("auth_token");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_auth_userId_key" ON "telegram_auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_telegram_id_key" ON "telegram"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_user_id_key" ON "telegram"("user_id");

-- AddForeignKey
ALTER TABLE "telegram" ADD CONSTRAINT "telegram_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

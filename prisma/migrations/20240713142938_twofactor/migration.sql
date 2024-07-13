/*
  Warnings:

  - You are about to drop the column `telegram_id` on the `telegram` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_username` on the `telegram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[auth_token]` on the table `telegram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `auth_token` to the `telegram` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "twoFactorAuthEnum" AS ENUM ('NONE', 'TELEGRAM', 'EMAIL');

-- DropIndex
DROP INDEX "telegram_telegram_id_key";

-- AlterTable
ALTER TABLE "telegram" DROP COLUMN "telegram_id",
DROP COLUMN "telegram_username",
ADD COLUMN     "auth_token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "twoFactorAuth" "twoFactorAuthEnum" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX "telegram_auth_token_key" ON "telegram"("auth_token");

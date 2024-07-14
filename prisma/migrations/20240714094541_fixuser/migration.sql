/*
  Warnings:

  - You are about to drop the column `twoFactorAuth` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "twoFactorAuth",
ADD COLUMN     "two_factor_auth" "twoFactorAuthEnum" NOT NULL DEFAULT 'NONE';

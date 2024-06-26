-- DropForeignKey
ALTER TABLE "alert" DROP CONSTRAINT "alert_user_id_fkey";

-- AlterTable
ALTER TABLE "alert" ADD COLUMN     "is_global" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "alert" ADD CONSTRAINT "alert_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

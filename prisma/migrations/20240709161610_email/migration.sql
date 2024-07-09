-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isEmailVerify" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "email_confirms" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "url_tag" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_confirms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_confirms_user_id_key" ON "email_confirms"("user_id");

-- AddForeignKey
ALTER TABLE "email_confirms" ADD CONSTRAINT "email_confirms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

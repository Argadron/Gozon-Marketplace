-- CreateTable
CREATE TABLE "shared_basket" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "productsInfo" JSONB[],
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_basket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shared_basket_url_key" ON "shared_basket"("url");

-- AddForeignKey
ALTER TABLE "shared_basket" ADD CONSTRAINT "shared_basket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

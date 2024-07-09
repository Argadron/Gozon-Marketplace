/*
  Warnings:

  - A unique constraint covering the columns `[url_tag]` on the table `email_confirms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "email_confirms_url_tag_key" ON "email_confirms"("url_tag");

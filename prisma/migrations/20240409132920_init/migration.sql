/*
  Warnings:

  - You are about to drop the `log_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "log_events";

-- CreateTable
CREATE TABLE "audists" (
    "id" SERIAL NOT NULL,
    "id_class" INTEGER NOT NULL,
    "class_name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "audists_pkey" PRIMARY KEY ("id")
);

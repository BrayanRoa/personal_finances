/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_name_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL;

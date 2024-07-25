/*
  Warnings:

  - Added the required column `active` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "next_date" TIMESTAMP(3);

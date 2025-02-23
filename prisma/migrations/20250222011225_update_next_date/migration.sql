/*
  Warnings:

  - Made the column `next_date` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "date" SET DATA TYPE DATE,
ALTER COLUMN "next_date" SET NOT NULL,
ALTER COLUMN "next_date" SET DATA TYPE DATE;

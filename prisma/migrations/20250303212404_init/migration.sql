/*
  Warnings:

  - You are about to drop the column `balance` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `expenses` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `incomes` on the `Wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "balance",
DROP COLUMN "expenses",
DROP COLUMN "incomes";

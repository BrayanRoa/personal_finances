/*
  Warnings:

  - You are about to drop the `RecurringTransactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `active` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `next_date` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecurringTransactions" DROP CONSTRAINT "RecurringTransactions_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringTransactions" DROP CONSTRAINT "RecurringTransactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecurringTransactions" DROP CONSTRAINT "RecurringTransactions_walletId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "next_date" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "RecurringTransactions";

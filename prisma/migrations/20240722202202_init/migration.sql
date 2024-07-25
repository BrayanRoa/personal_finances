/*
  Warnings:

  - You are about to drop the `BudgetWallet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `percentage` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletId` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BudgetWallet" DROP CONSTRAINT "BudgetWallet_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetWallet" DROP CONSTRAINT "BudgetWallet_walletId_fkey";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "percentage" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "walletId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BudgetWallet";

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

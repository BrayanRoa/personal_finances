-- CreateTable
CREATE TABLE "BudgetWallet" (
    "budgetId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "BudgetWallet_pkey" PRIMARY KEY ("budgetId","walletId")
);

-- AddForeignKey
ALTER TABLE "BudgetWallet" ADD CONSTRAINT "BudgetWallet_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetWallet" ADD CONSTRAINT "BudgetWallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

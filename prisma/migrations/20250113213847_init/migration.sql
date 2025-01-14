-- CreateTable
CREATE TABLE "budget_transaction" (
    "id" SERIAL NOT NULL,
    "budgetId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "budget_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budget_transaction_budgetId_transactionId_key" ON "budget_transaction"("budgetId", "transactionId");

-- AddForeignKey
ALTER TABLE "budget_transaction" ADD CONSTRAINT "budget_transaction_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_transaction" ADD CONSTRAINT "budget_transaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

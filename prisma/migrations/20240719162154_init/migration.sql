/*
  Warnings:

  - You are about to drop the column `amount` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `current_amount` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limit_amount` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "amount",
ADD COLUMN     "current_amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "limit_amount" DECIMAL(65,30) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `initial_date` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `date` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "initial_date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

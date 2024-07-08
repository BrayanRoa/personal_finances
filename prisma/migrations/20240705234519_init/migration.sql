/*
  Warnings:

  - Added the required column `repeat` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "repeat" TEXT NOT NULL;

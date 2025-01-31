/*
  Warnings:

  - You are about to drop the column `name` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Icon` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Color_name_key";

-- DropIndex
DROP INDEX "Icon_name_key";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Icon" DROP COLUMN "name";

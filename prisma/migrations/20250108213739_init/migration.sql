/*
  Warnings:

  - Added the required column `updated_at` to the `BudgetCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BudgetCategory" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Verification_codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN,
    "active" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Verification_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Verification_codes" ADD CONSTRAINT "Verification_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

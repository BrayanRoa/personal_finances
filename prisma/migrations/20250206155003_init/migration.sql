-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authProvider" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

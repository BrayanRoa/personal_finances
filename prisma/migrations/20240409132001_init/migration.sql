-- CreateTable
CREATE TABLE "log_events" (
    "id" SERIAL NOT NULL,
    "id_class" INTEGER NOT NULL,
    "class_name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "log_events_pkey" PRIMARY KEY ("id")
);

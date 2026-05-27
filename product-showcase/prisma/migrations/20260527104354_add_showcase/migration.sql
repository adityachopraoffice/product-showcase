-- CreateTable
CREATE TABLE "Showcase" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "settings" TEXT NOT NULL DEFAULT '{}',
    "views" INTEGER NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Showcase_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "tenant" ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "themeConfig" JSONB;

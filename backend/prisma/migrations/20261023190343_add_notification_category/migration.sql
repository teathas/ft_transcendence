-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('ROOM', 'FRIEND', 'DM', 'ACCOUNT');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "category" "NotificationCategory" NOT NULL DEFAULT 'ACCOUNT';

-- CreateIndex
CREATE INDEX "Notification_recipientId_category_readAt_idx" ON "Notification"("recipientId", "category", "readAt");

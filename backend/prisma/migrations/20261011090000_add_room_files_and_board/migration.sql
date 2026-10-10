-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "boardSnapshot" JSONB,
ADD COLUMN     "boardUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "boardVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "RoomFile" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "uploaderId" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomFile_roomId_createdAt_idx" ON "RoomFile"("roomId", "createdAt");

-- AddForeignKey
ALTER TABLE "RoomFile" ADD CONSTRAINT "RoomFile_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomFile" ADD CONSTRAINT "RoomFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


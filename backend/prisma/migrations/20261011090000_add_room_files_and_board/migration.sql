-- Written to be safe to run on a database that already has some of these
-- objects (an earlier partial attempt, a `db push`): every step checks first.

-- AlterTable
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "boardSnapshot" JSONB,
ADD COLUMN IF NOT EXISTS "boardUpdatedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "boardVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE IF NOT EXISTS "RoomFile" (
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
CREATE INDEX IF NOT EXISTS "RoomFile_roomId_createdAt_idx" ON "RoomFile"("roomId", "createdAt");

-- AddForeignKey
ALTER TABLE "RoomFile" DROP CONSTRAINT IF EXISTS "RoomFile_roomId_fkey";
ALTER TABLE "RoomFile" ADD CONSTRAINT "RoomFile_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomFile" DROP CONSTRAINT IF EXISTS "RoomFile_uploaderId_fkey";
ALTER TABLE "RoomFile" ADD CONSTRAINT "RoomFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

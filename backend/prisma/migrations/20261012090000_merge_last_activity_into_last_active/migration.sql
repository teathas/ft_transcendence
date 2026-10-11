-- "lastActivityAt" (added on its own) and "lastActiveAt" (added with the room
-- files) meant the same thing. Keep one: "lastActiveAt". Safe to run whether
-- or not the old column is there.

-- AlterTable
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Room' AND column_name = 'lastActivityAt'
  ) THEN
    -- Whichever of the two is later is the real last activity.
    UPDATE "Room" SET "lastActiveAt" = GREATEST("lastActiveAt", "lastActivityAt");
    ALTER TABLE "Room" DROP COLUMN "lastActivityAt";
  END IF;
END $$;

-- CreateIndex
DROP INDEX IF EXISTS "Room_lastActivityAt_idx";
CREATE INDEX IF NOT EXISTS "Room_lastActiveAt_idx" ON "Room"("lastActiveAt");

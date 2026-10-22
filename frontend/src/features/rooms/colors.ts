/** Cursor colours, distinct enough to tell people apart on the board. */
export const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#0ea5e9"];

/** The API has no colour for people; one is derived from the id so it is stable. */
export function colorFor(userId: string) {
  let hash = 0;
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

/**
 * Chat name colours. Written out in full: Tailwind only generates classes it
 * can find in the code, so `text-chat-${n}` would never be styled.
 */
export const CHAT_NAME_CLASSES = [
  "text-chat-1",
  "text-chat-2",
  "text-chat-3",
  "text-chat-4",
  "text-chat-5",
  "text-chat-6",
  "text-chat-7",
  "text-chat-8",
] as const;

/** 1 to 8, from the same hash as `colorFor`: one colour per user, everywhere. */
export function chatColorIndex(userId: string) {
  let hash = 0;
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return (hash % CHAT_NAME_CLASSES.length) + 1;
}

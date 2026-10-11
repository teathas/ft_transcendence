/** Cursor colours, distinct enough to tell people apart on the board. */
export const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#0ea5e9"];

/** The API has no colour for people; one is derived from the id so it is stable. */
export function colorFor(userId: string) {
  let hash = 0;
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

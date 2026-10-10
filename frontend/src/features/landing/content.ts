/**
 * Landing copy and mock room data, kept out of the markup so the wording can
 * be edited without touching layout. The room content is deliberately real
 * classroom material rather than placeholder text.
 */

export const PARTICIPANTS = [
  { name: "Amina Chen", initials: "AC", role: "Teacher", color: "#6366f1" },
  { name: "Luca Moreau", initials: "LM", role: "Student", color: "#10b981" },
  { name: "Sara Diallo", initials: "SD", role: "Student", color: "#f59e0b" },
] as const;

/** `key` points into `dictionary.landing.showcase.messages`: the mockup is
 *  marketing copy, so its wording translates with everything else. */
export const CHAT_MESSAGES = [
  {
    author: "Luca Moreau",
    color: "#10b981",
    time: "10:04",
    key: "question",
  },
  {
    author: "Amina Chen",
    color: "#6366f1",
    time: "10:05",
    key: "answer",
  },
  {
    author: "Sara Diallo",
    color: "#f59e0b",
    time: "10:06",
    key: "gotIt",
  },
] as const;

export const ROOM_FILES = [
  { name: "algebra-notes.pdf", meta: "PDF · 240 KB", kind: "pdf" },
  { name: "exercise-3.png", meta: "Image · 1.2 MB", kind: "image" },
] as const;

export const ROOM_CODE = "ALG-4271";

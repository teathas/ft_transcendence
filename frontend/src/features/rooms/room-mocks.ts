import { MOCK_USER } from "@/features/auth/mocks";

import type { Message, Participant, RoomFile } from "./types";

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

/** Cursor colours, distinct enough to tell people apart on the board. */
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#0ea5e9"];

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: MOCK_USER.id,
    username: MOCK_USER.username,
    avatarUrl: MOCK_USER.avatarUrl,
    role: "host",
    online: true,
    color: COLORS[0],
  },
  {
    id: "b21d7f40-0000-4aa1-9d31-2c6f8e0a1100",
    username: "luca",
    avatarUrl: null,
    role: "guest",
    online: true,
    color: COLORS[1],
  },
  {
    id: "b21d7f40-0001-4aa1-9d31-2c6f8e0a1100",
    username: "sara",
    avatarUrl: null,
    role: "guest",
    online: true,
    color: COLORS[2],
  },
  {
    id: "b21d7f40-0002-4aa1-9d31-2c6f8e0a1100",
    username: "noor",
    avatarUrl: null,
    role: "guest",
    online: false,
    color: COLORS[3],
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "d1000000-0000-4000-8000-000000000001",
    authorId: MOCK_PARTICIPANTS[1].id,
    authorUsername: "luca",
    authorColor: COLORS[1],
    body: "How do we factor this one?",
    sentAt: minutesAgo(14),
  },
  {
    id: "d1000000-0000-4000-8000-000000000002",
    authorId: MOCK_USER.id,
    authorUsername: MOCK_USER.username,
    authorColor: COLORS[0],
    body: "Look for the perfect square — the middle term is the giveaway.",
    sentAt: minutesAgo(12),
  },
  {
    id: "d1000000-0000-4000-8000-000000000003",
    authorId: MOCK_PARTICIPANTS[2].id,
    authorUsername: "sara",
    authorColor: COLORS[2],
    body: "Got it, it's (x + 1)²",
    sentAt: minutesAgo(11),
  },
  {
    id: "d1000000-0000-4000-8000-000000000004",
    authorId: MOCK_USER.id,
    authorUsername: MOCK_USER.username,
    authorColor: COLORS[0],
    body: "Exactly. I've put the next one on the board — try it before I solve it.",
    sentAt: minutesAgo(4),
  },
];

export const MOCK_FILES: RoomFile[] = [
  {
    id: "e1000000-0000-4000-8000-000000000001",
    name: "algebra-notes.pdf",
    sizeBytes: 245_760,
    kind: "pdf",
    uploadedBy: MOCK_USER.username,
    uploadedAt: minutesAgo(50),
  },
  {
    id: "e1000000-0000-4000-8000-000000000002",
    name: "exercise-3.png",
    sizeBytes: 1_258_291,
    kind: "image",
    uploadedBy: "luca",
    uploadedAt: minutesAgo(22),
  },
  {
    id: "e1000000-0000-4000-8000-000000000003",
    name: "worksheet-answers.pdf",
    sizeBytes: 89_400,
    kind: "pdf",
    uploadedBy: "sara",
    uploadedAt: minutesAgo(6),
  },
];

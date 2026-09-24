import type { CreateRoomPayload, JoinRoomPayload, Room } from "./types";

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

/**
 * Stand-in rooms used while the backend has no `Room` model.
 *
 * Enabled by `NEXT_PUBLIC_ENABLE_MOCKS`; delete this file and the branch in
 * `rooms.api.ts` once real endpoints exist.
 */
export const MOCK_ROOMS: Room[] = [
  {
    id: "3f1c9a20-0001-4d7a-9f10-7c2b5e8a1d40",
    code: "ALG-4271",
    name: "Mathematics — Algebra",
    participantCount: 4,
    lastActiveAt: minutesAgo(3),
    createdAt: minutesAgo(60 * 24 * 2),
  },
  {
    id: "3f1c9a20-0002-4d7a-9f10-7c2b5e8a1d40",
    code: "PHY-8120",
    name: "Physics — Optics revision",
    participantCount: 7,
    lastActiveAt: minutesAgo(92),
    createdAt: minutesAgo(60 * 24 * 6),
  },
  {
    id: "3f1c9a20-0003-4d7a-9f10-7c2b5e8a1d40",
    code: "CS-0042",
    name: "C — Pointers workshop",
    participantCount: 12,
    lastActiveAt: minutesAgo(60 * 20),
    createdAt: minutesAgo(60 * 24 * 12),
  },
  {
    id: "3f1c9a20-0004-4d7a-9f10-7c2b5e8a1d40",
    code: "BIO-3310",
    name: "Biology — Cell division",
    participantCount: 2,
    lastActiveAt: minutesAgo(60 * 24 * 3),
    createdAt: minutesAgo(60 * 24 * 21),
  },
  {
    id: "3f1c9a20-0005-4d7a-9f10-7c2b5e8a1d40",
    code: "HIS-1789",
    name: "History — Study group",
    participantCount: 5,
    lastActiveAt: minutesAgo(60 * 24 * 9),
    createdAt: minutesAgo(60 * 24 * 30),
  },
];

/** A touch of latency, so loading states are exercised rather than skipped. */
function settle<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 450));
}

function codeFrom(name: string) {
  const letters = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${letters || "ROO"}-${digits}`;
}

export const roomsMocks = {
  list: () => settle(MOCK_ROOMS),

  create: ({ name }: CreateRoomPayload) =>
    settle<Room>({
      id: crypto.randomUUID(),
      code: codeFrom(name),
      name,
      participantCount: 1,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }),

  join: ({ code }: JoinRoomPayload) => {
    const known = MOCK_ROOMS.find((room) => room.code === code);
    return settle<Room>(
      known ?? {
        id: crypto.randomUUID(),
        code,
        name: `Room ${code}`,
        participantCount: 2,
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    );
  },
};

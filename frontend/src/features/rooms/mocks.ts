import { MOCK_USER } from "@/features/auth/mocks";
import { ApiError } from "@/lib/api";

import { MOCK_FILES, MOCK_MESSAGES, MOCK_PARTICIPANTS } from "./room-mocks";

import type {
  CreateRoomPayload,
  Message,
  RoomFile,
  JoinRoomPayload,
  Room,
  RoomPage,
  RoomQuery,
} from "./types";

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Computer Science",
  "Biology",
  "Chemistry",
  "History",
  "Languages",
] as const;

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const OTHER_OWNERS = [
  { id: "b21d7f40-0000-4aa1-9d31-2c6f8e0a1100", username: "luca" },
  { id: "b21d7f40-0001-4aa1-9d31-2c6f8e0a1100", username: "sara" },
  { id: "b21d7f40-0002-4aa1-9d31-2c6f8e0a1100", username: "noor" },
];

type Seed = [
  name: string,
  subject: (typeof SUBJECTS)[number],
  code: string,
  participants: number,
  minutesSinceActive: number,
  ownedByMe: boolean,
  archived?: boolean,
];

const SEEDS: Seed[] = [
  ["Mathematics — Algebra", "Mathematics", "ALG-4271", 4, 3, true],
  ["Physics — Optics revision", "Physics", "PHY-8120", 7, 92, false],
  ["C — Pointers workshop", "Computer Science", "CS-0042", 12, 60 * 20, true],
  ["Biology — Cell division", "Biology", "BIO-3310", 2, 60 * 24 * 3, false],
  ["History — Study group", "History", "HIS-1789", 5, 60 * 24 * 9, false],
  ["Linear algebra — Eigenvectors", "Mathematics", "ALG-7734", 9, 25, true],
  ["Calculus — Integration by parts", "Mathematics", "CAL-1120", 3, 180, false],
  ["Thermodynamics — Entropy", "Physics", "PHY-2211", 6, 60 * 6, false],
  ["Quantum basics", "Physics", "PHY-9004", 11, 60 * 30, false],
  ["Data structures — Trees", "Computer Science", "CS-1337", 15, 45, true],
  [
    "Algorithms — Dynamic programming",
    "Computer Science",
    "CS-2048",
    8,
    60 * 2,
    false,
  ],
  [
    "Unix — Processes and signals",
    "Computer Science",
    "CS-0777",
    5,
    60 * 50,
    false,
  ],
  ["Genetics — Mendel revisited", "Biology", "BIO-1865", 4, 60 * 24 * 2, false],
  [
    "Ecology — Field notes",
    "Biology",
    "BIO-4420",
    2,
    60 * 24 * 14,
    false,
    true,
  ],
  ["Organic chemistry — Alkanes", "Chemistry", "CHE-1200", 7, 60 * 8, false],
  ["Titration lab prep", "Chemistry", "CHE-3390", 3, 60 * 24, true],
  ["Periodic trends", "Chemistry", "CHE-5150", 6, 60 * 24 * 5, false],
  ["French Revolution timeline", "History", "HIS-1793", 10, 60 * 12, false],
  ["Cold War seminar", "History", "HIS-1947", 8, 60 * 24 * 6, false],
  [
    "Ancient Rome — Republic",
    "History",
    "HIS-0509",
    4,
    60 * 24 * 21,
    false,
    true,
  ],
  ["Spanish — Subjunctive drills", "Languages", "LAN-2040", 6, 60 * 4, true],
  ["German — Cases", "Languages", "LAN-3110", 5, 60 * 24 * 2, false],
  ["Japanese — Kanji hour", "Languages", "LAN-5520", 9, 60 * 36, false],
  ["Probability — Bayes", "Mathematics", "MAT-6180", 7, 60 * 18, false],
  [
    "Statistics — Hypothesis tests",
    "Mathematics",
    "MAT-7710",
    5,
    60 * 24 * 4,
    false,
  ],
  ["Electromagnetism — Fields", "Physics", "PHY-6600", 12, 60 * 60, false],
  ["Networking — TCP deep dive", "Computer Science", "CS-8080", 14, 15, true],
  [
    "Graph theory — Colouring",
    "Mathematics",
    "MAT-3030",
    3,
    60 * 24 * 11,
    false,
    true,
  ],
];

/**
 * Stand-in rooms used while the backend has no `Room` model.
 *
 * Enabled by `NEXT_PUBLIC_ENABLE_MOCKS`; delete this file and the branch in
 * `rooms.api.ts` once real endpoints exist.
 */
const CURATED_ROOMS: Room[] = SEEDS.map(
  (
    [name, subject, code, participants, minutes, ownedByMe, archived],
    index,
  ) => {
    const owner = ownedByMe
      ? { id: MOCK_USER.id, username: MOCK_USER.username }
      : OTHER_OWNERS[index % OTHER_OWNERS.length];

    return {
      id: `3f1c9a20-${String(index).padStart(4, "0")}-4d7a-9f10-7c2b5e8a1d40`,
      code,
      name,
      subject,
      status: archived ? "archived" : "active",
      participantCount: participants,
      ownerId: owner.id,
      ownerUsername: owner.username,
      lastActiveAt: minutesAgo(minutes),
      createdAt: minutesAgo(minutes + 60 * 24 * 30),
    };
  },
);

// Enough rooms that paging is genuinely exercised — the page list only needs
// to collapse ("1 2 3 … 10") past seven pages.
const VARIANTS: [string, (typeof SUBJECTS)[number], string][] = [
  ["Vectors — Dot and cross products", "Mathematics", "MAT"],
  ["Matrices — Determinants", "Mathematics", "MAT"],
  ["Series — Convergence tests", "Mathematics", "MAT"],
  ["Trigonometry — Identities", "Mathematics", "MAT"],
  ["Mechanics — Projectiles", "Physics", "PHY"],
  ["Waves — Interference", "Physics", "PHY"],
  ["Relativity — Time dilation", "Physics", "PHY"],
  ["Circuits — Kirchhoff", "Physics", "PHY"],
  ["Recursion — Base cases", "Computer Science", "CS"],
  ["Sorting — Quicksort walkthrough", "Computer Science", "CS"],
  ["Memory — Stack vs heap", "Computer Science", "CS"],
  ["Git — Rebase clinic", "Computer Science", "CS"],
  ["Shell — Redirections", "Computer Science", "CS"],
  ["Photosynthesis — Light reactions", "Biology", "BIO"],
  ["Anatomy — Circulatory system", "Biology", "BIO"],
  ["Evolution — Natural selection", "Biology", "BIO"],
  ["Stoichiometry drills", "Chemistry", "CHE"],
  ["Acids and bases", "Chemistry", "CHE"],
  ["Thermochemistry — Enthalpy", "Chemistry", "CHE"],
  ["Industrial Revolution", "History", "HIS"],
  ["Decolonisation seminar", "History", "HIS"],
  ["Medieval trade routes", "History", "HIS"],
  ["Italian — Passato prossimo", "Languages", "LAN"],
  ["Arabic — Root patterns", "Languages", "LAN"],
  ["Portuguese — Conversation hour", "Languages", "LAN"],
  ["Dutch — Word order", "Languages", "LAN"],
  ["Latin — Declensions", "Languages", "LAN"],
  ["Complex numbers — Polar form", "Mathematics", "MAT"],
  ["Nuclear physics — Decay", "Physics", "PHY"],
  ["Compilers — Lexing", "Computer Science", "CS"],
  ["Microbiology — Cultures", "Biology", "BIO"],
  ["Polymers — Chains", "Chemistry", "CHE"],
  ["Renaissance art history", "History", "HIS"],
  ["Korean — Hangul basics", "Languages", "LAN"],
  ["Discrete maths — Induction", "Mathematics", "MAT"],
  ["Optics — Lenses", "Physics", "PHY"],
];

const EXTRA_ROOMS: Room[] = VARIANTS.map(([name, subject, prefix], index) => {
  const owner =
    index % 7 === 0
      ? { id: MOCK_USER.id, username: MOCK_USER.username }
      : OTHER_OWNERS[index % OTHER_OWNERS.length];
  const minutes = 60 * (24 + index * 7);

  return {
    id: `7c4e1b80-${String(index).padStart(4, "0")}-4d7a-9f10-7c2b5e8a1d40`,
    code: `${prefix}-${String(2000 + index * 37).padStart(4, "0")}`,
    name,
    subject,
    status: index % 11 === 0 ? "archived" : "active",
    participantCount: 1 + ((index * 3) % 14),
    ownerId: owner.id,
    ownerUsername: owner.username,
    lastActiveAt: minutesAgo(minutes),
    createdAt: minutesAgo(minutes + 60 * 24 * 45),
  } satisfies Room;
});

export const MOCK_ROOMS: Room[] = [...CURATED_ROOMS, ...EXTRA_ROOMS];

/** A touch of latency, so loading states are exercised rather than skipped. */
function settle<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function codeFrom(name: string) {
  const letters = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  return `${letters || "ROO"}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

/** Filters, sorts and slices the way a real endpoint would. */
export function selectRooms(rooms: Room[], query: RoomQuery): RoomPage {
  const search = query.search.trim().toLowerCase();

  const matched = rooms.filter((room) => {
    if (
      search &&
      !room.name.toLowerCase().includes(search) &&
      !room.code.toLowerCase().includes(search) &&
      !room.subject.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (query.subject !== "all" && room.subject !== query.subject) return false;
    if (query.status !== "all" && room.status !== query.status) return false;
    if (query.ownership === "owned" && room.ownerId !== MOCK_USER.id) {
      return false;
    }
    if (query.ownership === "joined" && room.ownerId === MOCK_USER.id) {
      return false;
    }
    return true;
  });

  const sorted = [...matched].sort((a, b) => {
    if (query.sort === "name") return a.name.localeCompare(b.name);
    if (query.sort === "participants") {
      return b.participantCount - a.participantCount;
    }
    return (b.lastActiveAt ?? "").localeCompare(a.lastActiveAt ?? "");
  });

  const start = (query.page - 1) * query.pageSize;
  return {
    items: sorted.slice(start, start + query.pageSize),
    total: sorted.length,
  };
}

export const roomsMocks = {
  get: (code: string) => {
    const room = MOCK_ROOMS.find((candidate) => candidate.code === code);
    if (!room) {
      throw new ApiError(`No room with the code ${code}.`, { status: 404 });
    }
    return settle(room);
  },

  stats: () =>
    settle({
      total: MOCK_ROOMS.length,
      active: MOCK_ROOMS.filter((room) => room.status === "active").length,
      owned: MOCK_ROOMS.filter((room) => room.ownerId === MOCK_USER.id).length,
      participants: MOCK_ROOMS.reduce(
        (sum, room) => sum + room.participantCount,
        0,
      ),
    }),

  list: (query: RoomQuery) => settle(selectRooms(MOCK_ROOMS, query)),

  create: ({ name, subject }: CreateRoomPayload) =>
    settle<Room>({
      id: crypto.randomUUID(),
      code: codeFrom(name),
      name,
      subject,
      status: "active",
      participantCount: 1,
      ownerId: MOCK_USER.id,
      ownerUsername: MOCK_USER.username,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }),

  join: ({ roomId }: JoinRoomPayload) => {
    const known = MOCK_ROOMS.find((room) => room.id === roomId);
    return settle<Room>(
      known ?? {
        id: crypto.randomUUID(),
        code: roomId.slice(0, 8).toUpperCase(),
        name: `Room ${roomId.slice(0, 8)}`,
        subject: "Mathematics",
        status: "active",
        participantCount: 2,
        ownerId: OTHER_OWNERS[0].id,
        ownerUsername: OTHER_OWNERS[0].username,
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    );
  },
};

/** Room-detail panels. Chat is in-memory, so a sent message sticks per tab. */
const sentMessages: Message[] = [];
const uploadedFiles: RoomFile[] = [];

export const roomDetailMocks = {
  participants: () => settle(MOCK_PARTICIPANTS, 300),
  files: () => settle([...MOCK_FILES, ...uploadedFiles], 300),
  messages: () => settle([...MOCK_MESSAGES, ...sentMessages], 300),

  uploadFile: (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const kind: RoomFile["kind"] = [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "svg",
    ].includes(extension)
      ? "image"
      : extension === "pdf"
        ? "pdf"
        : "document";

    const uploaded: RoomFile = {
      id: crypto.randomUUID(),
      name: file.name,
      sizeBytes: file.size,
      kind,
      uploadedBy: MOCK_USER.username,
      uploadedAt: new Date().toISOString(),
    };
    uploadedFiles.push(uploaded);
    return settle(uploaded, 500);
  },

  sendMessage: (body: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      authorId: MOCK_USER.id,
      authorUsername: MOCK_USER.username,
      authorColor: MOCK_PARTICIPANTS[0].color,
      body,
      sentAt: new Date().toISOString(),
    };
    sentMessages.push(message);
    return settle(message, 200);
  },
};

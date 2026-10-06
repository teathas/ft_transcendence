/**
 * Development seed.
 *
 * Mirrors the data the frontend used to mock, so the UI looks the same once it
 * reads from the database. Idempotent: every row is upserted on a unique key,
 * so running it twice changes nothing.
 */
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Visibility } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/** Shared by every seeded account. Development only. */
const SEED_PASSWORD = 'password123';

const USERS = [
  { username: 'amina', email: 'amina@student.42.fr', bio: 'Maths teacher, fond of a well-drawn parabola.' },
  { username: 'luca', email: 'luca@student.42.fr', bio: 'Second year, allergic to segfaults.' },
  { username: 'sara', email: 'sara@student.42.fr', bio: 'Physics tutor. Ask me about optics.' },
  { username: 'noor', email: 'noor@student.42.fr', bio: null },
  { username: 'tomas', email: 'tomas@student.42.fr', bio: 'Chemistry lab assistant.' },
  { username: 'yuki', email: 'yuki@student.42.fr', bio: null },
  { username: 'mehdi', email: 'mehdi@student.42.fr', bio: 'History seminars, every Thursday.' },
  { username: 'ines', email: 'ines@student.42.fr', bio: null },
  { username: 'oscar', email: 'oscar@student.42.fr', bio: 'Language exchange organiser.' },
  { username: 'lea', email: 'lea@student.42.fr', bio: null },
  { username: 'jonas', email: 'jonas@student.42.fr', bio: 'Algorithms, mostly.' },
  { username: 'fatima', email: 'fatima@student.42.fr', bio: 'Biology, cells and chaos.' },
];

type RoomSeed = {
  name: string;
  subject: string;
  visibility: Visibility;
  /** Index into USERS. */
  owner: number;
  /** How many people sit in the room, owner included. */
  members: number;
};

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Computer Science',
  'Biology',
  'Chemistry',
  'History',
  'Languages',
] as const;

const ROOM_NAMES: [string, (typeof SUBJECTS)[number]][] = [
  ['Mathematics — Algebra', 'Mathematics'],
  ['Linear algebra — Eigenvectors', 'Mathematics'],
  ['Calculus — Integration by parts', 'Mathematics'],
  ['Probability — Bayes', 'Mathematics'],
  ['Statistics — Hypothesis tests', 'Mathematics'],
  ['Vectors — Dot and cross products', 'Mathematics'],
  ['Matrices — Determinants', 'Mathematics'],
  ['Series — Convergence tests', 'Mathematics'],
  ['Trigonometry — Identities', 'Mathematics'],
  ['Complex numbers — Polar form', 'Mathematics'],
  ['Discrete maths — Induction', 'Mathematics'],
  ['Graph theory — Colouring', 'Mathematics'],
  ['Physics — Optics revision', 'Physics'],
  ['Thermodynamics — Entropy', 'Physics'],
  ['Quantum basics', 'Physics'],
  ['Electromagnetism — Fields', 'Physics'],
  ['Mechanics — Projectiles', 'Physics'],
  ['Waves — Interference', 'Physics'],
  ['Relativity — Time dilation', 'Physics'],
  ['Circuits — Kirchhoff', 'Physics'],
  ['Nuclear physics — Decay', 'Physics'],
  ['Optics — Lenses', 'Physics'],
  ['C — Pointers workshop', 'Computer Science'],
  ['Data structures — Trees', 'Computer Science'],
  ['Algorithms — Dynamic programming', 'Computer Science'],
  ['Unix — Processes and signals', 'Computer Science'],
  ['Networking — TCP deep dive', 'Computer Science'],
  ['Recursion — Base cases', 'Computer Science'],
  ['Sorting — Quicksort walkthrough', 'Computer Science'],
  ['Memory — Stack vs heap', 'Computer Science'],
  ['Git — Rebase clinic', 'Computer Science'],
  ['Shell — Redirections', 'Computer Science'],
  ['Compilers — Lexing', 'Computer Science'],
  ['Biology — Cell division', 'Biology'],
  ['Genetics — Mendel revisited', 'Biology'],
  ['Ecology — Field notes', 'Biology'],
  ['Photosynthesis — Light reactions', 'Biology'],
  ['Anatomy — Circulatory system', 'Biology'],
  ['Evolution — Natural selection', 'Biology'],
  ['Microbiology — Cultures', 'Biology'],
  ['Organic chemistry — Alkanes', 'Chemistry'],
  ['Titration lab prep', 'Chemistry'],
  ['Periodic trends', 'Chemistry'],
  ['Stoichiometry drills', 'Chemistry'],
  ['Acids and bases', 'Chemistry'],
  ['Thermochemistry — Enthalpy', 'Chemistry'],
  ['Polymers — Chains', 'Chemistry'],
  ['History — Study group', 'History'],
  ['French Revolution timeline', 'History'],
  ['Cold War seminar', 'History'],
  ['Ancient Rome — Republic', 'History'],
  ['Industrial Revolution', 'History'],
  ['Decolonisation seminar', 'History'],
  ['Medieval trade routes', 'History'],
  ['Renaissance art history', 'History'],
  ['Spanish — Subjunctive drills', 'Languages'],
  ['German — Cases', 'Languages'],
  ['Japanese — Kanji hour', 'Languages'],
  ['Italian — Passato prossimo', 'Languages'],
  ['Arabic — Root patterns', 'Languages'],
  ['Portuguese — Conversation hour', 'Languages'],
  ['Dutch — Word order', 'Languages'],
  ['Latin — Declensions', 'Languages'],
  ['Korean — Hangul basics', 'Languages'],
];

const ROOMS: RoomSeed[] = ROOM_NAMES.map(([name, subject], index) => ({
  name,
  subject,
  // Roughly one room in six is private, so both paths are exercised.
  visibility: index % 6 === 0 ? Visibility.PRIVATE : Visibility.PUBLIC,
  owner: index % USERS.length,
  members: 1 + ((index * 5) % USERS.length),
}));

/** Deterministic, so re-seeding matches rooms instead of duplicating them. */
const inviteCodeFor = (index: number) =>
  (index + 1).toString(16).padStart(8, '0');

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const users = [];
  for (const user of USERS) {
    users.push(
      await prisma.user.upsert({
        where: { email: user.email },
        update: { username: user.username, bio: user.bio },
        create: { ...user, passwordHash },
      }),
    );
  }
  console.log(`users: ${users.length}`);

  let rooms = 0;
  let memberships = 0;

  for (const [index, seed] of ROOMS.entries()) {
    const owner = users[seed.owner];

    const room = await prisma.room.upsert({
      where: { inviteCode: inviteCodeFor(index) },
      update: { name: seed.name, subject: seed.subject, visibility: seed.visibility },
      create: {
        name: seed.name,
        subject: seed.subject,
        visibility: seed.visibility,
        inviteCode: inviteCodeFor(index),
        ownerId: owner.id,
      },
    });
    rooms += 1;

    // The owner plus a rotating slice of everyone else.
    const roster = new Set<string>([owner.id]);
    for (let offset = 1; offset < seed.members; offset += 1) {
      roster.add(users[(seed.owner + offset) % users.length].id);
    }

    for (const userId of roster) {
      await prisma.roomMember.upsert({
        where: { userId_roomId: { userId, roomId: room.id } },
        update: {},
        create: { userId, roomId: room.id },
      });
      memberships += 1;
    }
  }

  console.log(`rooms: ${rooms}`);
  console.log(`memberships: ${memberships}`);
  console.log(`every account signs in with: ${SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

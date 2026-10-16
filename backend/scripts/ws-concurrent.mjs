import { io } from 'socket.io-client';

const WS = process.env.WS_URL ?? 'https://localhost';
const API = process.env.API_URL ?? `${WS}/api`;
const ROOM = process.env.ROOM_ID;
const N = Number(process.env.N ?? 5);
const PASSWORD = 'Passw0rd!123';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${msg}`); if (!ok) failures++; };

async function post(path, body, token) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => null);
}

async function setupUser(i) {
  const email = `wsc${i}@test.com`;
  await post('/auth/register', { email, username: `wsc${i}`, password: PASSWORD }); // "already in use" is fine
  const { accessToken } = await post('/auth/login', { email, password: PASSWORD });
  await post(`/rooms/${ROOM}/join`, {}, accessToken); // "already a member" is fine
  return { name: `wsc${i}`, token: accessToken };
}

function connect(user) {
  return new Promise((resolve, reject) => {
    const s = io(WS, { transports: ['websocket'], reconnection: false, rejectUnauthorized: false, forceNew: true, auth: { token: user.token } });
    s.on('connect', () => resolve(s));
    s.on('connect_error', (e) => reject(new Error(`${user.name}: ${e.message}`)));
  });
}

const users = await Promise.all(Array.from({ length: N }, (_, i) => setupUser(i + 1)));
const sockets = await Promise.all(users.map(connect));
const ids = new Map();
const events = new Map();
await Promise.all(sockets.map(async (s, i) => {
  const { userId } = await s.timeout(3000).emitWithAck('health:ping');
  const ev = { joined: [], left: [] };
  ids.set(users[i].name, userId);
  events.set(users[i].name, ev);
  s.on('room:user-joined', (p) => ev.joined.push(p.userId));
  s.on('room:user-left', (p) => ev.left.push(p.userId));
}));
const allIds = [...ids.values()];
console.log(`${N} users connected\n-- 1. everyone joins the room at the same time`);

const acks = await Promise.all(sockets.map((s) => s.timeout(3000).emitWithAck('room:join', { roomId: ROOM })));
check(acks.every((a) => a.ok), 'all joins succeeded');
await sleep(500);
users.forEach((u, i) => {
  const ev = events.get(u.name);
  const known = new Set([...acks[i].present, ...ev.joined]);
  const noDupes = new Set(ev.joined).size === ev.joined.length;
  check(allIds.every((id) => known.has(id)) && noDupes && !ev.joined.includes(ids.get(u.name)),
    `${u.name} knows all ${N} users, no duplicates, never its own join`);
});

console.log('-- 2. half of the users close at the same time');
const half = Math.floor(N / 2);
const leavingIds = users.slice(0, half).map((u) => ids.get(u.name));
sockets.slice(0, half).forEach((s) => s.disconnect());
await sleep(500);
for (let i = half; i < N; i++) {
  const ev = events.get(users[i].name);
  check(leavingIds.every((id) => ev.left.filter((x) => x === id).length === 1),
    `${users[i].name} got exactly one user-left per leaver`);
}

console.log('-- 3. they come back at the same time');
const back = await Promise.all(users.slice(0, half).map(connect));
await Promise.all(back.map((s) => s.timeout(3000).emitWithAck('room:join', { roomId: ROOM })));
const { present } = await sockets[half].timeout(3000).emitWithAck('room:join', { roomId: ROOM });
check(allIds.every((id) => present.includes(id)) && new Set(present).size === present.length,
  `room shows all ${N} users, each once`);

[...sockets.slice(half), ...back].forEach((s) => s.disconnect());
console.log(failures === 0 ? '\nALL PASSED' : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
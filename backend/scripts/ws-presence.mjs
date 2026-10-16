import { io } from 'socket.io-client';

const url = process.env.WS_URL ?? 'https://localhost';
const apiUrl = process.env.API_URL ?? `${url}/api`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(name, token) {
  return new Promise((resolve, reject) => {
    const s = io(url, { transports: ['websocket'], reconnection: false, rejectUnauthorized: false, auth: { token } });
    s.on('connect', () => { console.log(`${name} connected`); resolve(s); });
    s.on('connect_error', (e) => reject(new Error(`${name} connect_error: ${e.message}`)));
  });
}

async function friendStatuses() {
  const res = await fetch(`${apiUrl}/friends`, { headers: { Authorization: `Bearer ${process.env.TOKEN_A}` } });
  const { items } = await res.json();
  return items.map((f) => `${f.user.username}=${f.user.status}`).join(', ') || '(no friends)';
}

const a = await connect('A', process.env.TOKEN_A);
const { userId: aId } = await a.timeout(3000).emitWithAck('health:ping');
a.on('presence:update', (p) => { if (p.userId !== aId) console.log('A got presence:update', p); });
console.log('online now:', await a.timeout(3000).emitWithAck('presence:list'));
console.log('friends list:', await friendStatuses());

const b1 = await connect('B tab1', process.env.TOKEN_B);
await sleep(300);
const b2 = await connect('B tab2', process.env.TOKEN_B);
await sleep(300);
console.log('friends list:', await friendStatuses());

console.log('-- B closes tab1 (B must stay online)');
b1.disconnect();
await sleep(300);
console.log('-- B closes tab2 (B must go offline)');
b2.disconnect();
await sleep(6000);
console.log('friends list:', await friendStatuses());
a.disconnect();
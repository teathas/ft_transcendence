import { io } from 'socket.io-client';

const url = process.env.WS_URL ?? 'https://localhost';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const start = Date.now();
const t = () => `[${((Date.now() - start) / 1000).toFixed(1)}s]`;

function connect(name, token) {
  return new Promise((resolve, reject) => {
    const s = io(url, { transports: ['websocket'], reconnection: false, rejectUnauthorized: false, auth: { token } });
    s.on('connect', () => { console.log(`${t()} ${name} connected`); resolve(s); });
    s.on('connect_error', (e) => reject(new Error(`${name} connect_error: ${e.message}`)));
  });
}

const a = await connect('A', process.env.TOKEN_A);
const { userId: aId } = await a.timeout(3000).emitWithAck('health:ping');
a.on('presence:update', (p) => {
  if (p.userId !== aId) console.log(`${t()} A got presence:update`, p.status);
});

let b = await connect('B', process.env.TOKEN_B);
await sleep(500);

console.log(`${t()} -- B reloads the page (gone for 1s)`);
b.disconnect();
await sleep(1000);
b = await connect('B again', process.env.TOKEN_B);
await sleep(1000);

console.log(`${t()} -- B closes the tab for good`);
b.disconnect();
await sleep(7000);
a.disconnect();
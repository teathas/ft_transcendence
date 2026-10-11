import { io } from 'socket.io-client';

const url = process.env.WS_URL ?? 'https://localhost';
const roomId = process.env.ROOM_ID;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(name, token) {
  return new Promise((resolve, reject) => {
    const s = io(url, { transports: ['websocket'], reconnection: false, rejectUnauthorized: false, auth: { token } });
    s.on('connect', () => resolve(s));
    s.on('connect_error', (e) => reject(new Error(`${name} connect_error: ${e.message}`)));
  });
}

const a = await connect('A', process.env.TOKEN_A);
a.on('room:user-joined', (p) => console.log('   A got room:user-joined', p.userId));
a.on('room:user-left', (p) => console.log('   A got room:user-left', p.userId));
console.log('A joins:', await a.timeout(3000).emitWithAck('room:join', { roomId }));

const b1 = await connect('B tab1', process.env.TOKEN_B);
console.log('B tab1 joins:', await b1.timeout(3000).emitWithAck('room:join', { roomId }));
await sleep(300);

const b2 = await connect('B tab2', process.env.TOKEN_B);
console.log('B tab2 joins (A must get nothing):', await b2.timeout(3000).emitWithAck('room:join', { roomId }));
await sleep(300);

console.log('-- B tab2 leaves the room (A must get nothing)');
await b2.timeout(3000).emitWithAck('room:leave', { roomId });
await sleep(300);

console.log('-- B tab1 closes (A must get user-left)');
b1.disconnect();
await sleep(500);

a.disconnect();
b2.disconnect();
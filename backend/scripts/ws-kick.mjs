import { io } from 'socket.io-client';

const url = process.env.WS_URL ?? 'http://localhost:3001';
const roomId = process.env.ROOM_ID;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(name, token) {
  return new Promise((resolve, reject) => {
    const s = io(url, { transports: ['websocket'], reconnection: false, auth: { token } });
    s.on('connect', () => { console.log(`${name} connected`); resolve(s); });
    s.on('connect_error', (e) => reject(new Error(`${name} connect_error: ${e.message}`)));
  });
}

const a = await connect('A', process.env.TOKEN_A);
const b = await connect('B', process.env.TOKEN_B);
a.on('room:member-left', (p) => console.log('A received room:member-left', p));
b.on('room:user-joined', (p) => console.log('B received room:user-joined (BUG: should not happen)', p));

console.log('A join ack:', await a.timeout(3000).emitWithAck('room:join', { roomId }));
console.log('B join ack:', await b.timeout(3000).emitWithAck('room:join', { roomId }));

const res = await fetch(`${url}/rooms/${roomId}/leave`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${process.env.TOKEN_B}` },
});
console.log('B REST leave status:', res.status);
await sleep(300);

// A leaves and rejoins the channel: the server tells "others in the room".
// B was removed, so B must hear nothing.
await a.timeout(3000).emitWithAck('room:leave', { roomId });
console.log('A rejoin ack:', await a.timeout(3000).emitWithAck('room:join', { roomId }));

await sleep(500);
a.disconnect();
b.disconnect();
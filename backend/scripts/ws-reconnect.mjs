import { io } from 'socket.io-client';

const url = process.env.WS_URL ?? 'https://localhost';
const start = Date.now();
const t = () => `[${((Date.now() - start) / 1000).toFixed(1)}s]`;
const myRooms = new Set([process.env.ROOM_ID]);

const socket = io(url, {
  transports: ['websocket'],
  rejectUnauthorized: false, // local self-signed cert only
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  // Called before every connection attempt, so a reconnect sends the current token.
  auth: (cb) => cb({ token: process.env.TOKEN }),
});

socket.on('connect', async () => {
  console.log(`${t()} connected ${socket.id}`);
  for (const roomId of myRooms) {
    try {
      const ack = await socket.timeout(3000).emitWithAck('room:join', { roomId });
      console.log(`${t()} joined room again:`, ack);
    } catch {
      console.log(`${t()} room:join timed out`);
    }
  }
});
socket.on('disconnect', (reason) => console.log(`${t()} disconnected: ${reason}`));
socket.on('connect_error', (e) => console.log(`${t()} connect_error: ${e.message}`));
socket.io.on('reconnect_attempt', (n) => console.log(`${t()} reconnect attempt ${n}`));

setTimeout(() => {
  console.log(`${t()} done`);
  socket.disconnect();
}, 60_000);
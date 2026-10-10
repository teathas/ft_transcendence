import { io } from 'socket.io-client';

const url = process.env.WS_URL ?? 'http://localhost:3000';
const socket = io(url, { transports: ['websocket'], reconnection: false, rejectUnauthorized: false, auth: { token: process.env.TOKEN }, });
socket.on('connect', async () => {
	console.log('connected:', socket.id);
	try {
		const reply = await socket.timeout(3000).emitWithAck('health:ping');
		console.log('ack:', reply);
	} catch (err) {
		console.error('no ack:', err.message);
	}
	socket.disconnect();
});

socket.on('connect_error', (err) => {
	console.error('connect_error:', err.message);
	process.exit(1);
});

socket.on('disconnect', (reason) => console.log('disconnected:', reason));
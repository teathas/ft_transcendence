# WebSocket (Socket.IO)

## Connect
- URL: `NEXT_PUBLIC_WS_URL` (behind nginx: `wss://localhost`, path `/socket.io/`).
- Send the JWT with a function, so reconnects use the current token:
```js
  const socket = io(WS_URL, { auth: (cb) => cb({ token: getToken() }) });
```
- A wrong, expired, or logged-out token: `connect_error` with message `Unauthorized`.
  The client does NOT retry by itself. Get a valid token, then call `socket.connect()`.

## Client → server (with ack)
| Event | Data | Ack |
|---|---|---|
| `room:join` | `{ roomId }` | `{ ok: true, present: userId[] }` or `{ ok: false, error }` |
| `room:leave` | `{ roomId }` | `{ ok: true }` |
| `presence:list` | — | `{ ok: true, userIds: string[] }` |

## Server → client
| Event | Data | Sent to |
|---|---|---|
| `presence:update` | `{ userId, status }` | everyone |
| `room:user-joined` | `{ roomId, userId }` | others in the room (first tab of the user) |
| `room:user-left` | `{ roomId, userId }` | others in the room (last tab of the user) |
| `room:member-left` | `{ roomId, userId }` | the room, when someone leaves it via REST |
| `room:message` | `{ roomId, message: { id, content, userId, roomId, createdAt, author: { id, username, avatarUrl } } }` | the room, including the sender's tabs, after the message is saved |
<<<<<<< HEAD
| `room:file-added` | `{ roomId, file: { id, name, url, size, mimeType, createdAt, uploader: { id, username } \| null } }` | the room, after the file is saved |
| `room:file-removed` | `{ roomId, fileId }` | the room, after the uploader or the room owner deletes a file |
=======
| `dm:message` | `{ message: { id, content, senderId, receiverId, createdAt, readAt } }` | the receiver and the sender (all their tabs), after the DM is saved |
| `dm:read` | `{ readerId }` | the friend whose messages were just read, only if at least one was unread |

>>>>>>> main

## Rules
- A user is ONLINE with at least one socket. OFFLINE comes 5 seconds after the last socket closes.
- Joining a room channel needs a room membership (REST `POST /rooms/:id/join` first).
- **After every reconnect, join your rooms again.** A new connection has no rooms.
- New events use the form `domain:action`.
- Events about saved data are sent only after the database write succeeds.

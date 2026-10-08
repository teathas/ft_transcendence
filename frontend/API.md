# Frontend ↔ API

What the frontend calls, what the backend actually serves, and what is still
standing in for a missing route. Verified on 2026-10-06 against the NestJS app
running on a seeded database.

## Live — verified end to end

Everything below goes through nginx on one origin, so there is no CORS at all.


| Frontend call | Backend route | Request | Response |
| --- | --- | --- | --- |
| `authApi.register` | `POST /auth/register` | `{email, username (3–20), password (≥8)}` | the user, **no token** |
| `authApi.login` | `POST /auth/login` | `{email, password}` | `{accessToken}`, **no user** |
| `authApi.session` | `GET /users/me` | Bearer | full user |
| boot restore | `POST /auth/refresh` | refresh cookie | `{accessToken}` |
| `authApi.updateProfile` | `PATCH /users/me` | `{username?, bio?}` | user |
| `authApi.uploadAvatar` | `POST /users/me/avatar` | multipart `avatar`, ≤5 MB, jpg/jpeg/png/webp | user |
| `authApi.logout` | `POST /auth/logout` | Bearer | `{message}` |
| `roomsApi.create` | `POST /rooms` | `{name, subject, visibility}` | room + `inviteCode` |
| `roomsApi.join` | `POST /rooms/:roomId/join` | `{inviteCode?}` | room membership |

Two adaptations live in `features/auth/api/auth.api.ts` because the backend
returns less than the UI needs:

- `login` chains `GET /users/me`, since the token comes back on its own.
- `register` immediately logs in, since registering issues no token — otherwise
  a brand-new account would land back on the sign-in screen.

## Still mocked — no route exists

These run from `features/rooms/mocks.ts` behind `NEXT_PUBLIC_ENABLE_MOCKS`.
Turning mocks off makes each one 404.

| Frontend call | Route it wants | Needed for |
| --- | --- | --- |
| `roomsApi.list` | `GET /rooms?search&subject&status&ownership&sort&page&pageSize` → `{items, total}` | rooms browser, dashboard |
| `roomsApi.stats` | `GET /rooms/stats` → `{total, active, owned, participants}` | KPI row |
| `roomsApi.get` | `GET /rooms/:code` → room | room page |
| `roomsApi.update` | `PATCH /rooms/:id` ← `{name, subject, visibility}` → room | edit room |
| `roomsApi.remove` | `DELETE /rooms/:id` | delete room |
| `roomsApi.participants` | `GET /rooms/:code/participants` | People panel |
| `roomsApi.messages` / `sendMessage` | `GET`/`POST /rooms/:code/messages` | chat |
| `roomsApi.files` / `uploadFile` | `GET`/`POST /rooms/:code/files` | files panel |

The list view also expects fields the `Room` model does not carry:
`participantCount`, `lastActiveAt`, `status` (active/archived) and
`ownerUsername`. The first two can be derived from `RoomMember`; the last two
need a column or a decision to drop them from the UI.

## Features removed for lack of an endpoint

- **Change password** — no route.
- **Delete account** — no route.
- **Remove an avatar** — `POST /users/me/avatar` sets one; nothing clears it.

## Known gaps

1. **The access token is held in memory** (`lib/api/tokens.ts`), never on disk:
   anything in `localStorage` is enumerable by an injected script and outlives
   the browser being closed. Surviving a reload is the refresh cookie's job.
   The last known user *is* cached in `localStorage`
   (`features/auth/session-cache.ts`) — it is a paint optimisation, re-validated
   with zod on read, always refetched, and cleared on sign-out.

2. **Joining by code is impossible.** `POST /rooms/:roomId/join` needs the room
   *id*, and there is no lookup by `inviteCode`, so the join form has to ask for
   an id — which nobody shares. A `GET /rooms/by-code/:inviteCode` would fix it.
3. **CORS.** The frontend sends no credentials (`withCredentials: false` in
   `lib/api/client.ts`), which is what makes the current backend config work. The
   day `/auth/refresh` sets an httpOnly cookie, that flips back to `true` and the
   backend must then send `Access-Control-Allow-Credentials: true` with a
   concrete origin — a wildcard is rejected once credentials are involved.

## Seed accounts

`backend/prisma/seed.ts` creates 12 users, 64 rooms and their memberships.
Every account signs in with **`password123`** — for example
`amina@student.42.fr`. Re-running the seed is safe: every row is upserted.

## Session: refresh cookie, live

The backend issues a refresh token as an httpOnly cookie and the frontend
restores the session on boot. Verified through nginx, in a browser: after a
reload the app calls `POST /api/auth/refresh`, gets a new access token and
`GET /api/users/me` succeeds — with nothing in `localStorage` and the cookie
unreadable from JavaScript.

How it fits together:

- The **access token stays in memory** (`lib/api/tokens.ts`). It is short-lived
  and never written to disk.
- The **refresh token lives only in the cookie**:
  `HttpOnly; SameSite=Lax; Path=/api/auth/refresh`. The path is the one the
  *browser* sees — nginx serves the API under `/api` — so the cookie is not
  attached to any other request.
- `POST /auth/refresh` returns the access token **in the body**. That is also
  what makes CSRF on this route harmless: another site can trigger the call but
  cannot read the reply.
- **Rotation with reuse detection.** Each refresh revokes the token it consumed.
  Presenting an already-rotated token means the cookie leaked, so every refresh
  token the user holds is revoked and they must sign in again. Tested.
- `ensureSessionRestored` serialises the boot exchange, so the session query
  cannot race ahead and take a 401 before the refresh lands.

`REFRESH_COOKIE_SECURE` is explicit rather than derived from `NODE_ENV`: Chrome
makes an exception for `http://localhost`, but a `Secure` cookie over plain HTTP
is dropped everywhere else. Set it to `true` as soon as TLS is in front.

## Rooms CRUD

Create, read, update and delete are all wired in the UI and work today against
the mock store, which is mutable on purpose: editing or deleting a room is
reflected in the list, the filters and the pagination. Owner-only actions are
gated on `room.ownerId === user.id`. When the backend exposes `PATCH` and
`DELETE`, only the two branches in `rooms.api.ts` change.

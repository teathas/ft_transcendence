*This project has been created as part of the 42 curriculum by aberkass, [add your login here] *

# Shared Room
## Description
## Instructions
## Team Information

| Login | Role(s) | Responsibilities |
|---|---|---|
| aberkass | Product Owner, Backend Developer | Created and prioritized the product backlog. Built the backend for authentication, users, friendships and real-time presence. |

## Project Management
## Technical Stack
## Database Schema
## Features List

| Feature | Who | Description |
|---|---|---|
| Sign up / log in / log out | aberkass | Email and password auth. Passwords are hashed with bcrypt (salted). Login returns a short-lived JWT access token and a refresh token. Logout revokes the access token (its `jti` is saved in a `RevokedToken` table) and deletes the refresh session. |
| User profiles | aberkass | View your own profile and other users' public profiles. Update profile info, change password, delete account, search users. |
| Avatar upload | aberkass | Upload an avatar (JPG, PNG or WebP, max 5 MB) or remove it. Validated on the server (type and size). |
| Friends | aberkass | Send, accept, reject and cancel friend requests. Remove a friend. List friends, sent and received requests (with search and pagination). A notification is created for friend requests. |
| Online status | aberkass | Users see who is online in real time. A user is ONLINE while at least one tab is connected, and OFFLINE 5 seconds after the last tab closes. The status and `lastSeenAt` are saved in the database. |
| Real-time layer (Socket.IO) | aberkass | One WebSocket connection per tab, checked with the JWT at connection time. Each user has a private channel and each room has a room channel. Events (room messages, files, DMs, presence) are sent only after the database write succeeds. Full event list: [backend/docs/websocket.md](backend/docs/websocket.md). |
| Room presence | aberkass | Shows who is inside a room right now. Only room members can join a room channel. "Joined" / "left" events are sent once per user, even with many tabs open. |

## Modules

| Module | Type | Points | Who |
|---|---|---|---|
| Standard user management and authentication | Major | 2 | aberkass |
| Real-time features using WebSockets | Major | 2 | aberkass |
| Allow users to interact with other users (chat, profile, friends) | Major | 2 | aberkass (profile, friends), iel-fouh (chat) |

**Standard user management (Major, 2 pts)**
- Why: Shared Room is a social workspace, so users need profiles, avatars and friends.
- How: NestJS `users` and `friends` modules with Prisma. Profile update (`PATCH /users/me`), avatar upload (`POST /users/me/avatar`), public profile page (`GET /users/:id`), full friend request flow (`/friends/...`). Friends' online status comes from the real-time module.

**Real-time features using WebSockets (Major, 2 pts)**
- Why: whiteboard, chat, files and presence must update for every user at the same time.
- How: a Socket.IO gateway in NestJS. The JWT is checked before a socket is accepted. Users and rooms each get their own channel, so events go only to the people who need them. Disconnects are handled gracefully: a 5-second grace period avoids "offline" flicker when a user refreshes the page, and room "left" events are sent when the last tab closes.

**Allow users to interact (Major, 2 pts)**
- Why: users must find each other and talk inside the app.
- How: aberkass built the profile and friends systems (see above). iel-fouh built the chat.

## Individual Contributions

### aberkass — Product Owner, Backend Developer
- **Project:** wrote the product backlog, created the GitHub repository and the Discord server.
- **Auth:** register, login, refresh, logout, JWT guard on every route, token revocation.
- **Users:** profile, avatar upload, password change, account deletion, user search.
- **Friendships:** friend requests, friends list, notifications for friend events.
- **Real-time:** Socket.IO gateway, presence service, user and room channels, WebSocket docs.

## Resources

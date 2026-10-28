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

PostgreSQL, managed with Prisma ORM. Source of truth: [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

```mermaid
erDiagram
    User ||--o{ Room : "owns"
    User ||--o{ RoomMember : "is member"
    Room ||--o{ RoomMember : "has members"
    User ||--o{ Message : "writes"
    Room ||--o{ Message : "contains"
    Room ||--o{ RoomFile : "contains"
    User |o--o{ RoomFile : "uploads"
    User ||--o{ Friendship : "sends request"
    User ||--o{ Friendship : "receives request"
    User ||--o{ DirectMessage : "sends"
    User ||--o{ DirectMessage : "receives"
    User ||--o{ Notification : "receives"
    User |o--o{ Notification : "triggers"
    User ||--o{ ApiKey : "owns"
    User ||--o{ RefreshSession : "has"

    User {
        String id PK "uuid"
        String email UK
        String username UK
        String passwordHash "bcrypt"
        String avatarUrl "nullable"
        String bio "nullable"
        String language "nullable: en, fr, ar"
        String accentColor "nullable"
        Boolean termsAccepted
        UserStatus status "ONLINE | OFFLINE"
        DateTime lastSeenAt "nullable"
        DateTime createdAt
        DateTime updatedAt
    }
    Room {
        String id PK "uuid"
        String name
        String subject
        Visibility visibility "PUBLIC | PRIVATE"
        String inviteCode UK
        String ownerId FK
        DateTime createdAt
        DateTime lastActiveAt
        Json boardSnapshot "nullable, tldraw"
        Int boardVersion
        DateTime boardUpdatedAt "nullable"
    }
    RoomMember {
        String userId PK, FK
        String roomId PK, FK
        DateTime joinedAt
    }
    Message {
        String id PK "uuid"
        String content
        String userId FK
        String roomId FK
        DateTime createdAt
    }
    RoomFile {
        String id PK "uuid"
        String roomId FK
        String uploaderId FK "nullable"
        String name
        String url
        Int size
        String mimeType
        DateTime createdAt
    }
    Friendship {
        String id PK "uuid"
        String requesterId FK
        String addresseeId FK
        String lowId "unique pair with highId"
        String highId
        FriendshipStatus status "PENDING | ACCEPTED"
        DateTime createdAt
        DateTime updatedAt
    }
    DirectMessage {
        String id PK "uuid"
        String content
        String senderId FK
        String receiverId FK
        DateTime createdAt
        DateTime readAt "nullable"
    }
    Notification {
        String id PK "uuid"
        String recipientId FK
        String actorId FK "nullable"
        NotificationType type
        Json data "nullable"
        DateTime readAt "nullable"
        DateTime createdAt
    }
    ApiKey {
        String id PK "uuid"
        String name
        String prefix
        String keyHash UK "SHA-256"
        String userId FK
        DateTime createdAt
        DateTime lastUsedAt "nullable"
        DateTime expiresAt "nullable"
        DateTime revokedAt "nullable"
    }
    RefreshSession {
        String id PK "uuid"
        String tokenHash UK "SHA-256"
        String userId FK
        DateTime expiresAt
        DateTime createdAt
    }
    RevokedToken {
        String jti PK
        DateTime expiresAt
        DateTime createdAt
    }
```

### Tables

| Table | Purpose |
|---|---|
| `User` | Account, profile, preferences and online status. |
| `Room` | A shared workspace. Holds the whiteboard snapshot. |
| `RoomMember` | Join table: which users are in which rooms (many-to-many). |
| `Message` | A chat message inside a room. |
| `RoomFile` | A file shared in a room. Bytes are on disk; the row keeps the metadata. |
| `Friendship` | A friend request (`PENDING`) or a friendship (`ACCEPTED`). |
| `DirectMessage` | A private message between two friends. |
| `Notification` | An event shown to a user (friend request, new message, file uploaded, ...). |
| `ApiKey` | Key for the public API. Only its hash is stored. |
| `RefreshSession` | A login session. Only the refresh token's hash is stored. |
| `RevokedToken` | Access tokens that were logged out before they expired. |

### Key design choices
- **One friendship per pair:** `lowId` / `highId` hold the two user ids sorted. With `@@unique([lowId, highId])`, A→B and B→A can't both exist.
- **No overwrite on the whiteboard:** `boardVersion` goes up on each save. A save based on an older version is refused.
- **No secrets stored in plain text:** passwords use bcrypt; refresh tokens and API keys use SHA-256.
- **Deleting a user:** their sessions, friendships, DMs and notifications are deleted (`onDelete: Cascade`). Their shared files stay in the room (`uploaderId` becomes `NULL`).

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

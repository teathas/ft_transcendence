# frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

## Getting started

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at the backend
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                 | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Dev server (Turbopack)                           |
| `npm run build`        | Production build (`output: "standalone"`)        |
| `npm start`            | Serve the production build                       |
| `npm run typecheck`    | Regenerate route types, then `tsc --noEmit`      |
| `npm run lint`         | ESLint (`lint:fix` to autofix)                   |
| `npm run format`       | Prettier write (`format:check` to verify)        |
| `npm run check`        | typecheck + lint + format:check — run before a PR |

## Folder structure

```
src/
├─ app/                   routes ONLY — no business logic
│  ├─ (auth)/             route group: /login, /register (centered shell)
│  ├─ (main)/             route group: everything behind the site header
│  ├─ layout.tsx          fonts, metadata, <Providers>
│  ├─ providers.tsx       theme + TanStack Query client (client component)
│  ├─ globals.css         Tailwind entry + design tokens
│  ├─ error.tsx           root error boundary
│  └─ not-found.tsx       404
├─ components/
│  ├─ ui/                 unstyled-ish primitives: button, card, input, field, alert
│  ├─ layout/             site chrome (header, footers, shells)
│  └─ theme/              next-themes provider + toggle
├─ features/              one folder per domain — the place new code goes
│  └─ auth/
│     ├─ api/             functions that call the backend
│     ├─ components/      feature-specific UI
│     ├─ hooks/           useQuery / useMutation wrappers
│     ├─ schemas.ts       zod schemas — the source of truth for shapes
│     ├─ types.ts         types inferred from schemas.ts
│     └─ index.ts         public surface of the feature
├─ config/site.ts         app name, description, nav
├─ hooks/                 cross-feature hooks
├─ lib/
│  ├─ api/                axios instance, error normalisation, token store, response parsing
│  ├─ query/              query client factory + query-key factory
│  ├─ env.ts              NEXT_PUBLIC_* vars, validated with zod at import
│  └─ utils.ts            cn()
└─ types/                 cross-feature types
```

### Conventions

- **Routes stay thin.** `app/` composes; logic lives in `features/`.
- **Cross-feature imports go through the barrel** (`@/features/auth`), never
  deep into another feature's internals.
- **Every HTTP call goes through `@/lib/api`.** ESLint blocks importing `axios`
  directly anywhere outside `src/lib/api/`.
- **Every query key comes from `lib/query/keys.ts`**, so server prefetches and
  client reads share one identity and invalidation is greppable.
- **Schemas own the shapes.** Write the zod schema, then derive the TypeScript
  type with `z.infer` — never hand-write a type next to a schema.

## Data layer

`src/lib/api/client.ts` exports the single configured axios instance:

- `baseURL` from `NEXT_PUBLIC_API_URL`, `withCredentials` for the session cookie
- attaches `Authorization: Bearer …` from an in-memory token store
- on `401`, refreshes once (concurrent 401s share one round-trip) and retries
- rejects with `ApiError` — never a raw `AxiosError`

From a Server Component, forward the incoming cookies:

```ts
import { api, serverConfig } from "@/lib/api/server";

const { data } = await api.get("/users/me", await serverConfig());
```

## Validation (zod)

Zod is used at all three boundaries where untrusted data enters the app:

| Boundary        | Where                       | On failure                            |
| --------------- | --------------------------- | ------------------------------------- |
| Environment     | `lib/env.ts`                | throws at import — the build fails    |
| Form input      | `features/*/schemas.ts`     | per-field messages, no request sent   |
| API responses   | `lib/api/parse.ts`          | `ApiError` with code `INVALID_RESPONSE` |

Forms and the backend report field errors in the same
`Record<string, string[]>` shape — zod's `flattenError().fieldErrors` and
`ApiError.fieldErrors` — so one rendering path covers both:

```tsx
<AuthForm schema={loginSchema} ... onSubmit={(values) => login.mutate(values)} />
```

`onSubmit` receives parsed, typed data: `AuthForm` is generic over the schema,
so changing the schema changes the callback's argument type.

Validate a response at the boundary rather than trusting it:

```ts
const { data } = await api.get("/auth/me");
return parseResponse(userSchema, data, "GET /auth/me");
```

## Theming

Tokens are defined once in `src/app/globals.css` — `:root` for light, `.dark`
for dark — and exposed to Tailwind through `@theme inline`. There is no
`tailwind.config.js`; add a token to both blocks and it becomes a utility.
`next-themes` writes the class before first paint, so there is no flash.

## Notes on Next.js 16

- Middleware is now **`proxy.ts`** (same behaviour, new name).
- `typedRoutes` is enabled: `<Link href>` is checked against real routes, so a
  link to a route that does not exist yet fails the build.
- `AGENTS.md` is regenerated by `next dev`; commit it with your changes.

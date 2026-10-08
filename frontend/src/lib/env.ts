import { z } from "zod";

/**
 * Public runtime configuration, validated at import time so a typo in
 * `.env.local` fails immediately instead of surfacing as a confusing 404.
 */
const envSchema = z.object({
  /**
   * Absolute URL in development, or a path such as `/api` once nginx serves
   * the frontend and the API from one origin — which removes CORS entirely.
   */
  NEXT_PUBLIC_API_URL: z
    .string()
    .refine(
      (value) => /^https?:\/\//.test(value) || value.startsWith("/"),
      "NEXT_PUBLIC_API_URL must be an http(s) URL, or a path like /api when the frontend and the API share an origin",
    )
    .default("http://localhost:8000/api"),

  NEXT_PUBLIC_WS_URL: z
    .url({
      protocol: /^wss?$/,
      error: "NEXT_PUBLIC_WS_URL must be a ws(s) URL",
    })
    .default("ws://localhost:8000"),

  // Serves rooms from `src/features/rooms/mocks.ts` instead of the API, so the
  // UI is usable before the backend exists. Unset in production.
  NEXT_PUBLIC_ENABLE_MOCKS: z.stringbool().default(false),

  /**
   * How the whiteboard shares state:
   * - `local`  — browser-only, no cursors (the default until a server exists)
   * - `demo`   — tldraw's public demo server: real cursors, public data
   * - `server` — our own sync server at NEXT_PUBLIC_SYNC_URL
   */
  NEXT_PUBLIC_SYNC_MODE: z.enum(["local", "demo", "server"]).default("local"),

  NEXT_PUBLIC_SYNC_URL: z
    .url({
      protocol: /^wss?$/,
      error: "NEXT_PUBLIC_SYNC_URL must be a ws(s) URL",
    })
    .optional(),
});

/**
 * Docker build args that are not set expand to an empty string, which is not
 * `undefined` and would therefore skip the schema defaults (or fail outright).
 * Blank means "not provided".
 */
const blankAsUndefined = (value: string | undefined) =>
  value === undefined || value.trim() === "" ? undefined : value;

// Next inlines `NEXT_PUBLIC_*` at build time, so each variable has to be read
// as a full literal property access — never `process.env[name]`.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: blankAsUndefined(process.env.NEXT_PUBLIC_API_URL),
  NEXT_PUBLIC_WS_URL: blankAsUndefined(process.env.NEXT_PUBLIC_WS_URL),
  NEXT_PUBLIC_ENABLE_MOCKS: blankAsUndefined(
    process.env.NEXT_PUBLIC_ENABLE_MOCKS,
  ),
  NEXT_PUBLIC_SYNC_MODE: blankAsUndefined(process.env.NEXT_PUBLIC_SYNC_MODE),
  NEXT_PUBLIC_SYNC_URL: blankAsUndefined(process.env.NEXT_PUBLIC_SYNC_URL),
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = {
  /** Base URL of the backend REST API. */
  apiUrl: parsed.data.NEXT_PUBLIC_API_URL,
  /** Base URL of the realtime gateway. */
  wsUrl: parsed.data.NEXT_PUBLIC_WS_URL,
  /** True while the frontend serves its own mock rooms. */
  enableMocks: parsed.data.NEXT_PUBLIC_ENABLE_MOCKS,
  /** Whiteboard sync strategy — see the schema above. */
  syncMode: parsed.data.NEXT_PUBLIC_SYNC_MODE,
  syncUrl: parsed.data.NEXT_PUBLIC_SYNC_URL,
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;

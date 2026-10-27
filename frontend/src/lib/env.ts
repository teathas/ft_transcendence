import { z } from "zod";

/**
 * Public runtime configuration, validated at import time so a typo in
 * `.env.local` fails immediately instead of surfacing as a confusing 404.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url({
      protocol: /^https?$/,
      error: "NEXT_PUBLIC_API_URL must be an http(s) URL",
    })
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
   * - `server` — the API's own sync server (the default): live cursors and
   *               drawing, saved with the room. Used as `local` while mocks
   *               are on, since there is no API then.
   * - `local`  — browser-only, no cursors
   * - `demo`   — tldraw's public demo server: real cursors, public data
   */
  NEXT_PUBLIC_SYNC_MODE: z.enum(["local", "demo", "server"]).default("server"),

  /** Where the sync server is. Unset: the API's own address, as ws(s). */
  NEXT_PUBLIC_SYNC_URL: z
    .url({
      protocol: /^wss?$/,
      error: "NEXT_PUBLIC_SYNC_URL must be a ws(s) URL",
    })
    .optional(),

  /**
   * tldraw's licence key. It is read by the browser, so it ends up in the
   * bundle: that is how tldraw works, the key is tied to our domain. Empty
   * means no licence (tldraw then shows its "made with tldraw" watermark).
   */
  NEXT_PUBLIC_TLDRAW_LICENSE_KEY: z
    .string()
    .optional()
    .transform((key) => key || undefined),
});

// Next inlines `NEXT_PUBLIC_*` at build time, so each variable has to be read
// as a full literal property access — never `process.env[name]`.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  NEXT_PUBLIC_ENABLE_MOCKS: process.env.NEXT_PUBLIC_ENABLE_MOCKS,
  NEXT_PUBLIC_SYNC_MODE: process.env.NEXT_PUBLIC_SYNC_MODE,
  NEXT_PUBLIC_SYNC_URL: process.env.NEXT_PUBLIC_SYNC_URL,
  NEXT_PUBLIC_TLDRAW_LICENSE_KEY: process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY,
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
  syncMode: parsed.data.NEXT_PUBLIC_ENABLE_MOCKS
    ? "local"
    : parsed.data.NEXT_PUBLIC_SYNC_MODE,
  syncUrl:
    parsed.data.NEXT_PUBLIC_SYNC_URL ??
    parsed.data.NEXT_PUBLIC_API_URL.replace(/^http/, "ws"),
  /** Passed to every <Tldraw>. */
  tldrawLicenseKey: parsed.data.NEXT_PUBLIC_TLDRAW_LICENSE_KEY,
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;

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
});

// Next inlines `NEXT_PUBLIC_*` at build time, so each variable has to be read
// as a full literal property access — never `process.env[name]`.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  NEXT_PUBLIC_ENABLE_MOCKS: process.env.NEXT_PUBLIC_ENABLE_MOCKS,
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
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;

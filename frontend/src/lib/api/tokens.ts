/**
 * Access token store. The HttpOnly refresh cookie cannot be read by JavaScript;
 * it is used automatically by the API client when this short-lived token expires.
 *
 * Every storage access is wrapped: it throws on the server (there is no
 * `localStorage` there) and in private windows with storage blocked, and the
 * app must still render in both cases.
 */
const KEY = "access_token";

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(token: string | null) {
  try {
    if (token) localStorage.setItem(KEY, token);
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the token then only lives until the page is closed.
  }
}

let accessToken: string | null = null;

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

/**
 * Seconds before a JWT expires, read from its payload (negative once expired).
 * Only to decide when to renew: the server stays the one that verifies it.
 */
export function secondsUntilExpiry(token: string): number {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload)) as { exp: number };
    return exp - Date.now() / 1000;
  } catch {
    return 0;
  }
}

export const tokenStore = {
  // Read lazily, so the first call in the browser picks up a saved token.
  get: () => (accessToken ??= read()),

  set(token: string | null) {
    accessToken = token;
    write(token);
    for (const listener of listeners) listener(token);
  },

  clear() {
    tokenStore.set(null);
  },

  /** Subscribe to token changes. Returns an unsubscribe function. */
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

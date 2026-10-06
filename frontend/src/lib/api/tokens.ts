const STORAGE_KEY = "shared-room.access-token";

/**
 * Access token store, mirrored into `localStorage` so a page reload keeps you
 * signed in.
 *
 * The trade-off is deliberate: anything in `localStorage` is readable by an
 * injected script, which an in-memory token is not. Moving the refresh token
 * into an httpOnly cookie later is what removes that exposure.
 */
let accessToken: string | null = null;
let restored = false;

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

/** Reads can run during SSR, where there is no storage and no token. */
function readStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private windows and blocked site data both throw here.
    return null;
  }
}

function writeStorage(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Storage being unavailable must not break signing in.
  }
}

export const tokenStore = {
  get() {
    // Restored on first read rather than at module load, so the server bundle
    // never touches storage.
    if (!restored) {
      restored = true;
      accessToken = readStorage();
    }
    return accessToken;
  },

  set(token: string | null) {
    restored = true;
    accessToken = token;
    writeStorage(token);
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

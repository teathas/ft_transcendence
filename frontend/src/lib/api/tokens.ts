/**
 * In-memory access token store.
 *
 * Deliberately not `localStorage`: a token kept in memory is not readable by
 * injected scripts and disappears with the tab. The long-lived refresh token
 * is expected to live in an httpOnly cookie set by the backend, which the
 * axios instance sends via `withCredentials`.
 */
let accessToken: string | null = null;

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export const tokenStore = {
  get: () => accessToken,

  set(token: string | null) {
    accessToken = token;
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

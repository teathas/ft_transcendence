/**
 * In-memory access token store.
 *
 * Deliberately not `localStorage`: a token there is enumerable by any injected
 * script and survives the browser being closed, so a single leak stays
 * exploitable. Held in a module variable it dies with the tab, which narrows
 * the window to the active session.
 *
 * Surviving a reload is the refresh token's job — an httpOnly cookie the
 * backend sets, exchanged for a fresh access token on boot. See
 * `useRestoreSession`.
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

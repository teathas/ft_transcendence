/**
 * Whether the backend is answering.
 *
 * "Unreachable" means a request got no HTTP response at all — the server is
 * stopped, the address is wrong, or it timed out. Any response, even an error
 * status, proves it is up. Set by the axios interceptors in `client.ts`.
 */
let reachable = true;

const listeners = new Set<() => void>();

export const connectionStore = {
  get: () => reachable,

  set(next: boolean) {
    if (next === reachable) return;
    reachable = next;
    for (const listener of listeners) listener();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

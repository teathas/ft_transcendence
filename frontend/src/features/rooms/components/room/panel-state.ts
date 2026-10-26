import { ROOM_PANELS, type RoomPanel } from "./room-panels";

/** One layout preference for every room, like the sidebar rail. */
const KEY = "room-panel";

type PanelState = { open: boolean; tab: RoomPanel };

/** Tablets and up: the panel sits beside the board. On phones it is a sheet over it. */
const isWide = () => window.matchMedia("(min-width: 48rem)").matches;

const isPanel = (value: unknown): value is RoomPanel =>
  ROOM_PANELS.some((panel) => panel.id === value);

/** The saved layout. Phones always start closed: the sheet would hide the board. */
export function readPanelState(): PanelState {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const { open, tab } = (saved ?? {}) as Partial<
      Record<"open" | "tab", unknown>
    >;
    return {
      open: open === true && isWide(),
      tab: isPanel(tab) ? tab : "chat",
    };
  } catch {
    // Blocked storage or a broken value: start as if nothing was saved.
    return { open: false, tab: "chat" };
  }
}

/** Only wide screens write, so a phone's forced "closed" never erases the choice. */
export function savePanelState(state: PanelState) {
  if (!isWide()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked: the panel still works, it just is not remembered.
  }
}

/**
 * Stand-in activity figures for the dashboard.
 *
 * Nothing here is measured yet — the backend has no sessions, messages or
 * files. Delete this file once those endpoints exist.
 */
export type ActivityPoint = {
  /** ISO weekday, 1 = Monday. The name is formatted per locale at render. */
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  minutes: number;
};

export const WEEK_ACTIVITY: ActivityPoint[] = [
  { weekday: 1, minutes: 45 },
  { weekday: 2, minutes: 80 },
  { weekday: 3, minutes: 30 },
  { weekday: 4, minutes: 115 },
  { weekday: 5, minutes: 65 },
  { weekday: 6, minutes: 20 },
  { weekday: 7, minutes: 55 },
];

export const DASHBOARD_STATS = {
  roomsJoined: 12,
  minutesCollaborated: WEEK_ACTIVITY.reduce((sum, d) => sum + d.minutes, 0),
  messagesSent: 348,
  filesShared: 19,
};

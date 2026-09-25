/**
 * Stand-in activity figures for the dashboard.
 *
 * Nothing here is measured yet — the backend has no sessions, messages or
 * files. Delete this file once those endpoints exist.
 */
export type ActivityPoint = {
  label: string;
  fullLabel: string;
  minutes: number;
};

export const WEEK_ACTIVITY: ActivityPoint[] = [
  { label: "M", fullLabel: "Monday", minutes: 45 },
  { label: "T", fullLabel: "Tuesday", minutes: 80 },
  { label: "W", fullLabel: "Wednesday", minutes: 30 },
  { label: "T", fullLabel: "Thursday", minutes: 115 },
  { label: "F", fullLabel: "Friday", minutes: 65 },
  { label: "S", fullLabel: "Saturday", minutes: 20 },
  { label: "S", fullLabel: "Sunday", minutes: 55 },
];

export const DASHBOARD_STATS = {
  roomsJoined: 12,
  minutesCollaborated: WEEK_ACTIVITY.reduce((sum, d) => sum + d.minutes, 0),
  messagesSent: 348,
  filesShared: 19,
};

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

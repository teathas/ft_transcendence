const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

/**
 * "3 minutes ago", "last week", …
 *
 * Only ever call this from the browser: it reads the current time, which would
 * differ between server and client render and trip a hydration mismatch.
 */
export function formatRelativeTime(iso: string, now = Date.now()) {
  // Pinned to "en" to match <html lang="en">. Leaving this undefined follows
  // the visitor's OS locale, which drops French strings into an English page.
  // Swap for the active locale when i18n lands.
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  let duration = (new Date(iso).getTime() - now) / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "year");
}

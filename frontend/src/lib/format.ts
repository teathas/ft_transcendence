"use client";

import { useMemo } from "react";

import { useLocale } from "@/i18n/client";

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
 * Dates and durations in the language the page is in.
 *
 * `Intl` does the wording — "3 minutes ago", "il y a 3 minutes",
 * "قبل 3 دقائق" — so none of this lives in the dictionary. The locale comes
 * from the URL rather than the visitor's OS, which is what keeps a French
 * timestamp out of an Arabic page.
 *
 * Browser-only on purpose: these read the current clock, and a server render
 * would disagree with the client's by a few milliseconds and trip hydration.
 */
export function useFormat() {
  const locale = useLocale();

  return useMemo(() => {
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
    const time = new Intl.DateTimeFormat(locale, { timeStyle: "short" });

    return {
      /** "3 minutes ago", "last week", … */
      relativeTime(iso: string, now = Date.now()): string {
        let duration = (new Date(iso).getTime() - now) / 1000;

        for (const division of DIVISIONS) {
          if (Math.abs(duration) < division.amount) {
            return relative.format(Math.round(duration), division.unit);
          }
          duration /= division.amount;
        }

        return relative.format(Math.round(duration), "year");
      },

      /** "12 September 2026" */
      date: (iso: string) => date.format(new Date(iso)),

      /** "10:04" */
      time: (iso: string) => time.format(new Date(iso)),
    };
  }, [locale]);
}

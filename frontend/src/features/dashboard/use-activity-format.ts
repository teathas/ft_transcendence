"use client";

import { useMemo } from "react";

import { useDict, useLocale } from "@/i18n/client";
import { t } from "@/i18n/translate";

// Any week works; only the weekday matters. 2024-01-01 was a Monday, so
// adding the ISO weekday minus one lands on the right day.
const MONDAY = Date.UTC(2024, 0, 1);

/**
 * Weekday names come from `Intl`, not the dictionary — every language already
 * ships them, and "Lundi"/"الاثنين" is not wording anyone should maintain.
 * Durations do need the dictionary, since "1h 20m" is a pattern, not a unit.
 */
export function useActivityFormat() {
  const locale = useLocale();
  const { duration: pattern } = useDict().dashboard;

  return useMemo(() => {
    const long = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      timeZone: "UTC",
    });
    const narrow = new Intl.DateTimeFormat(locale, {
      weekday: "narrow",
      timeZone: "UTC",
    });
    const dayOf = (weekday: number) =>
      new Date(MONDAY + (weekday - 1) * 86_400_000);

    return {
      weekdayLong: (weekday: number) => long.format(dayOf(weekday)),
      weekdayNarrow: (weekday: number) => narrow.format(dayOf(weekday)),
      duration(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const rest = minutes % 60;
        if (hours === 0) return t(pattern.minutes, { minutes: rest });
        if (rest === 0) return t(pattern.hours, { hours });
        return t(pattern.hoursMinutes, { hours, minutes: rest });
      },
    };
  }, [locale, pattern]);
}

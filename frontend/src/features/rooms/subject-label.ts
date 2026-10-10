"use client";

import { useDict } from "@/i18n/client";

import { SUBJECTS } from "./mocks";

type Subject = (typeof SUBJECTS)[number];

function isSubject(value: string): value is Subject {
  return (SUBJECTS as readonly string[]).includes(value);
}

/**
 * Subjects are stored in English — they are the value the API filters on — so
 * only the label is translated. A subject the dictionary has never heard of
 * falls back to its stored name rather than disappearing.
 */
export function useSubjectLabel() {
  const d = useDict();
  return (subject: string) =>
    isSubject(subject) ? d.rooms.subjects[subject] : subject;
}

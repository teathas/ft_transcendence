"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { useDict } from "@/i18n/client";

import { SUBJECTS } from "../mocks";
import { useSubjectLabel } from "../subject-label";

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const d = useDict();
  const [draft, setDraft] = useState(value);

  // Debounced, so typing does not rewrite the URL on every keystroke.
  useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => onChange(draft), 350);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  return (
    <div className="relative min-w-60 flex-1">
      <Search
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={d.rooms.toolbar.searchPlaceholder}
        aria-label={d.rooms.toolbar.searchLabel}
        className="ps-9"
      />
    </div>
  );
}

export function RoomsToolbar({
  search,
  subject,
  sort,
  isFiltered,
  onChange,
  onReset,
}: {
  search: string;
  subject: string;
  sort: string;
  isFiltered: boolean;
  onChange: (patch: Record<string, string>) => void;
  onReset: () => void;
}) {
  const d = useDict();
  const subjectLabel = useSubjectLabel();

  const subjectOptions: SelectOption[] = [
    { value: "all", label: d.rooms.toolbar.allSubjects },
    ...SUBJECTS.map((subject) => ({
      value: subject,
      label: subjectLabel(subject),
    })),
  ];

  const sortOptions: SelectOption[] = [
    { value: "recent", label: d.rooms.toolbar.mostRecent },
    { value: "name", label: d.rooms.toolbar.nameAz },
    { value: "participants", label: d.rooms.toolbar.mostPeople },
  ];

  const pick = (options: SelectOption[], value: string) =>
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchField
        value={search}
        onChange={(next) => onChange({ search: next })}
      />

      <Select
        className="min-w-36 flex-1 sm:w-44 sm:flex-none"
        aria-label={d.rooms.toolbar.subject}
        options={subjectOptions}
        value={pick(subjectOptions, subject)}
        onChange={(option) => option && onChange({ subject: option.value })}
        isSearchable={false}
      />

      <Select
        className="min-w-36 flex-1 sm:w-44 sm:flex-none"
        aria-label={d.rooms.toolbar.sortBy}
        options={sortOptions}
        value={pick(sortOptions, sort)}
        onChange={(option) => option && onChange({ sort: option.value })}
        isSearchable={false}
      />

      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="px-1 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {d.common.clear}
        </button>
      )}
    </div>
  );
}

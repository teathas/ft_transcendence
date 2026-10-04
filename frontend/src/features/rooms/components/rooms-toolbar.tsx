"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { SUBJECTS } from "../mocks";

const SUBJECT_OPTIONS: SelectOption[] = [
  { value: "all", label: "All subjects" },
  ...SUBJECTS.map((subject) => ({ value: subject, label: subject })),
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "Any status" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

const OWNERSHIP_OPTIONS: SelectOption[] = [
  { value: "all", label: "Everyone's rooms" },
  { value: "owned", label: "Rooms I own" },
  { value: "joined", label: "Rooms I joined" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "recent", label: "Most recent" },
  { value: "name", label: "Name (A–Z)" },
  { value: "participants", label: "Most people" },
];

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  // Debounced, so typing does not rewrite the URL on every keystroke.
  useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => onChange(draft), 350);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  return (
    <div className="relative min-w-0 flex-1 lg:max-w-sm">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search rooms, codes, subjects…"
        aria-label="Search rooms"
        className="pl-9"
      />
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: string;
  onChange: (next: string) => void;
}) {
  const options = [
    { value: "cards", label: "Card view", icon: LayoutGrid },
    { value: "table", label: "Table view", icon: List },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="View"
      className="flex items-center gap-0.5 rounded-lg border p-0.5"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={view === value}
          aria-label={label}
          title={label}
          onClick={() => onChange(value)}
          className={cn(
            "rounded-md p-2 transition-colors",
            view === value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export function RoomsToolbar({
  search,
  subject,
  status,
  ownership,
  sort,
  view,
  isFiltered,
  onChange,
  onReset,
}: {
  search: string;
  subject: string;
  status: string;
  ownership: string;
  sort: string;
  view: string;
  isFiltered: boolean;
  onChange: (patch: Record<string, string>) => void;
  onReset: () => void;
}) {
  const pick = (options: SelectOption[], value: string) =>
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Search owns its own row: sharing one wrapping row with four
          fixed-width selects squeezed it to ~50px at every width below xl. */}
      <div className="flex items-center gap-3">
        <SearchField
          value={search}
          onChange={(next) => onChange({ search: next })}
        />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
          <ViewToggle
            view={view}
            onChange={(next) => onChange({ view: next })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Select
          aria-label="Subject"
          options={SUBJECT_OPTIONS}
          value={pick(SUBJECT_OPTIONS, subject)}
          onChange={(option) => option && onChange({ subject: option.value })}
          isSearchable={false}
        />

        <Select
          aria-label="Status"
          options={STATUS_OPTIONS}
          value={pick(STATUS_OPTIONS, status)}
          onChange={(option) => option && onChange({ status: option.value })}
          isSearchable={false}
        />

        <Select
          aria-label="Ownership"
          options={OWNERSHIP_OPTIONS}
          value={pick(OWNERSHIP_OPTIONS, ownership)}
          onChange={(option) => option && onChange({ ownership: option.value })}
          isSearchable={false}
        />

        <Select
          aria-label="Sort by"
          options={SORT_OPTIONS}
          value={pick(SORT_OPTIONS, sort)}
          onChange={(option) => option && onChange({ sort: option.value })}
          isSearchable={false}
        />
      </div>
    </div>
  );
}

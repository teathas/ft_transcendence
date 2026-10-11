"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

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
    <div className="relative min-w-0 flex-1 lg:max-w-sm">
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

function ViewToggle({
  view,
  onChange,
}: {
  view: string;
  onChange: (next: string) => void;
}) {
  const d = useDict();
  const options = [
    { value: "cards", label: d.rooms.toolbar.cardView, icon: LayoutGrid },
    { value: "table", label: d.rooms.toolbar.tableView, icon: List },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={d.rooms.toolbar.view}
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
  const d = useDict();
  const subjectLabel = useSubjectLabel();

  const subjectOptions: SelectOption[] = [
    { value: "all", label: d.rooms.toolbar.allSubjects },
    ...SUBJECTS.map((subject) => ({
      value: subject,
      label: subjectLabel(subject),
    })),
  ];

  const statusOptions: SelectOption[] = [
    { value: "all", label: d.rooms.toolbar.anyStatus },
    { value: "active", label: d.rooms.status.active },
    { value: "archived", label: d.rooms.status.archived },
  ];

  const ownershipOptions: SelectOption[] = [
    { value: "all", label: d.rooms.toolbar.everyonesRooms },
    { value: "owned", label: d.rooms.toolbar.roomsIOwn },
    { value: "joined", label: d.rooms.toolbar.roomsIJoined },
  ];

  const sortOptions: SelectOption[] = [
    { value: "recent", label: d.rooms.toolbar.mostRecent },
    { value: "name", label: d.rooms.toolbar.nameAz },
    { value: "participants", label: d.rooms.toolbar.mostPeople },
  ];

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

        <div className="ms-auto flex shrink-0 items-center gap-2">
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{d.common.clear}</span>
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
          aria-label={d.rooms.toolbar.subject}
          options={subjectOptions}
          value={pick(subjectOptions, subject)}
          onChange={(option) => option && onChange({ subject: option.value })}
          isSearchable={false}
        />

        <Select
          aria-label={d.rooms.toolbar.status}
          options={statusOptions}
          value={pick(statusOptions, status)}
          onChange={(option) => option && onChange({ status: option.value })}
          isSearchable={false}
        />

        <Select
          aria-label={d.rooms.toolbar.ownership}
          options={ownershipOptions}
          value={pick(ownershipOptions, ownership)}
          onChange={(option) => option && onChange({ ownership: option.value })}
          isSearchable={false}
        />

        <Select
          aria-label={d.rooms.toolbar.sortBy}
          options={sortOptions}
          value={pick(sortOptions, sort)}
          onChange={(option) => option && onChange({ sort: option.value })}
          isSearchable={false}
        />
      </div>
    </div>
  );
}

"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { ViewToggle } from "@/components/ui/view-toggle";
import { useDict } from "@/i18n/client";

/**
 * The row above every list: search, then whatever filters the tab has, then
 * "clear" and the cards/table switch.
 */
export function ListToolbar({
  search,
  onSearch,
  placeholder,
  view,
  onView,
  isFiltered,
  onReset,
  children,
}: {
  search: string;
  onSearch: (next: string) => void;
  placeholder: string;
  view: string;
  onView: (next: string) => void;
  isFiltered: boolean;
  onReset: () => void;
  /** The tab's own filters, e.g. a sort or a relationship select. */
  children?: React.ReactNode;
}) {
  const d = useDict();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <SearchField
          value={search}
          onChange={onSearch}
          placeholder={placeholder}
          label={d.friends.toolbar.searchLabel}
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
            onChange={onView}
            label={d.friends.toolbar.view}
            cardsLabel={d.friends.toolbar.cardView}
            tableLabel={d.friends.toolbar.tableView}
          />
        </div>
      </div>

      {children}
    </div>
  );
}

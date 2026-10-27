"use client";

import { useState } from "react";
import { DoorOpen, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { ViewToggle } from "@/components/ui/view-toggle";
import { useUrlState } from "@/hooks/use-url-state";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

import { useRooms, useRoomStats } from "../hooks/use-rooms";
import type { RoomQuery, RoomSort } from "../types";
import { CreateRoomModal } from "./create-room-modal";
import { JoinRoomModal } from "./join-room-modal";
import { RoomCard } from "./room-card";
import { RoomsTable } from "./rooms-table";
import { RoomsToolbar } from "./rooms-toolbar";

// Module scope: `useUrlState` needs a stable reference.
const DEFAULTS = {
  search: "",
  subject: "all",
  status: "all",
  ownership: "all",
  sort: "recent",
  view: "cards",
  page: "1",
  pageSize: "12",
};

/** Each tab is a preset of the two filters it replaced. */
const TABS = {
  all: { ownership: "all", status: "all" },
  owned: { ownership: "owned", status: "all" },
  archived: { ownership: "all", status: "archived" },
} as const;
type Tab = keyof typeof TABS;

export function RoomsBrowser() {
  const d = useDict();
  const [state, setState] = useUrlState(DEFAULTS);
  const [modal, setModal] = useState<"create" | "join" | null>(null);
  const { data: stats } = useRoomStats();

  // The tab decides ownership and status, so an old link such as
  // `?ownership=joined` falls back to "All" instead of a hidden filter.
  const tab: Tab =
    state.status === "archived"
      ? "archived"
      : state.ownership === "owned"
        ? "owned"
        : "all";

  const query: RoomQuery = {
    search: state.search,
    subject: state.subject,
    ...TABS[tab],
    sort: state.sort as RoomSort,
    page: Math.max(1, Number(state.page) || 1),
    pageSize: Math.max(1, Number(state.pageSize) || 12),
  };

  const { data, isPending, error, refetch, isFetching } = useRooms(query);

  /** Any filter change invalidates the current page number. */
  const setFilters = (patch: Record<string, string>) =>
    setState({ ...patch, page: "1" });

  const isFiltered =
    state.search !== DEFAULTS.search || state.subject !== DEFAULTS.subject;

  const tabItems = [
    { id: "all", label: d.rooms.tabs.all, count: stats?.total },
    { id: "owned", label: d.rooms.tabs.owned, count: stats?.owned },
    {
      id: "archived",
      label: d.rooms.tabs.archived,
      count: stats ? stats.total - stats.active : undefined,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {d.nav.allRooms}
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            {d.rooms.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setModal("join")}>
            {d.rooms.addMenu.joinWithCode}
          </Button>
          <Button onClick={() => setModal("create")}>{d.nav.newRoom}</Button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Both halves draw a bottom border, so one line runs under the
            tabs and the view switch. */}
        <div className="flex items-end">
          <div className="min-w-0 flex-1">
            <Tabs
              label={d.rooms.tabs.label}
              items={tabItems}
              value={tab}
              onChange={(id) => setFilters(TABS[id as Tab])}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2 border-b ps-4 pb-1.5">
            <span
              aria-hidden="true"
              className="hidden text-sm text-muted-foreground sm:inline"
            >
              {d.rooms.toolbar.view}
            </span>
            <ViewToggle
              view={state.view}
              onChange={(view) => setState({ view })}
              label={d.rooms.toolbar.view}
              cardsLabel={d.rooms.toolbar.cardView}
              tableLabel={d.rooms.toolbar.tableView}
            />
          </div>
        </div>

        <RoomsToolbar
          search={state.search}
          subject={state.subject}
          sort={state.sort}
          isFiltered={isFiltered}
          onChange={setFilters}
          onReset={() => setFilters({ search: "", subject: "all" })}
        />

        {isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : !data ? (
          // Only when there is nothing to show: a failed refresh keeps the
          // cached list on screen, and the banner explains why.
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10">
              <TriangleAlert
                className="size-5 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
            </span>
            <p className="font-medium">{d.rooms.error.title}</p>
            <p className="max-w-sm text-sm text-pretty text-muted-foreground">
              {isApiError(error) ? error.message : d.rooms.error.body}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {d.common.tryAgain}
            </Button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <DoorOpen className="size-5" aria-hidden="true" />
            </span>
            <p className="font-medium">
              {isFiltered || tab !== "all"
                ? d.rooms.empty.filteredTitle
                : d.rooms.empty.title}
            </p>
            <p className="max-w-xs text-sm text-pretty text-muted-foreground">
              {isFiltered || tab !== "all"
                ? d.rooms.empty.filteredBody
                : d.rooms.empty.body}
            </p>
          </div>
        ) : (
          <div
            // Dim rather than unmount while the next page loads.
            className={cn(
              "transition-opacity",
              isFetching && "pointer-events-none opacity-60",
            )}
          >
            {state.view === "table" ? (
              <RoomsTable rooms={data.items} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.items.map((room) => (
                  <RoomCard key={room.id} room={room} showStatus />
                ))}
              </div>
            )}
          </div>
        )}

        {data && (
          <Pagination
            page={query.page}
            pageSize={query.pageSize}
            totalItems={data.total}
            onPageChange={(page) => setState({ page: String(page) })}
            onPageSizeChange={(pageSize) =>
              setState({ pageSize: String(pageSize), page: "1" })
            }
          />
        )}
      </div>

      <CreateRoomModal
        open={modal === "create"}
        onClose={() => setModal(null)}
      />
      <JoinRoomModal open={modal === "join"} onClose={() => setModal(null)} />
    </div>
  );
}

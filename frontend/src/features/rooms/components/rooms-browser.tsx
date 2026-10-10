"use client";

import { DoorOpen, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrlState } from "@/hooks/use-url-state";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

import { useRooms } from "../hooks/use-rooms";
import type { RoomOwnership, RoomQuery, RoomSort, RoomStatus } from "../types";
import { AddRoomMenu } from "./add-room-menu";
import { RoomCard } from "./room-card";
import { RoomsKpis } from "./rooms-kpis";
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

export function RoomsBrowser() {
  const d = useDict();
  const [state, setState] = useUrlState(DEFAULTS);

  const query: RoomQuery = {
    search: state.search,
    subject: state.subject,
    status: state.status as RoomStatus | "all",
    ownership: state.ownership as RoomOwnership,
    sort: state.sort as RoomSort,
    page: Math.max(1, Number(state.page) || 1),
    pageSize: Math.max(1, Number(state.pageSize) || 12),
  };

  const { data, isPending, error, refetch, isFetching } = useRooms(query);

  /** Any filter change invalidates the current page number. */
  const setFilters = (patch: Record<string, string>) =>
    setState({ ...patch, page: "1" });

  const isFiltered =
    state.search !== DEFAULTS.search ||
    state.subject !== DEFAULTS.subject ||
    state.status !== DEFAULTS.status ||
    state.ownership !== DEFAULTS.ownership;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {d.rooms.title}
          </h1>
          <p className="text-pretty text-muted-foreground">
            {d.rooms.subtitle}
          </p>
        </div>

        <AddRoomMenu onFilter={setFilters} />
      </div>

      <RoomsKpis />

      <div className="flex flex-col gap-5">
        <RoomsToolbar
          search={state.search}
          subject={state.subject}
          status={state.status}
          ownership={state.ownership}
          sort={state.sort}
          view={state.view}
          isFiltered={isFiltered}
          onChange={setFilters}
          onReset={() =>
            setState({
              search: "",
              subject: "all",
              status: "all",
              ownership: "all",
              page: "1",
            })
          }
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
              {isFiltered ? d.rooms.empty.filteredTitle : d.rooms.empty.title}
            </p>
            <p className="max-w-xs text-sm text-pretty text-muted-foreground">
              {isFiltered ? d.rooms.empty.filteredBody : d.rooms.empty.body}
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
                  <RoomCard key={room.id} room={room} />
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
    </div>
  );
}

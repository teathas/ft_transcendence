"use client";

import { SearchX, TriangleAlert, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Select, type SelectOption } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { useUrlState } from "@/hooks/use-url-state";
import { useDict } from "@/i18n/client";
import { isApiError } from "@/lib/api";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import {
  useFriends,
  useFriendsSummary,
  usePeople,
  useRequests,
} from "../hooks/use-friends";
import type {
  FriendSort,
  Page,
  RelationshipFilter,
  RequestKind,
} from "../types";
import { ListToolbar } from "./list-toolbar";
import {
  ListMessage,
  PeopleList,
  PeopleSkeleton,
  type PersonRow,
} from "./people-list";
import {
  FriendActions,
  PersonActions,
  ReceivedActions,
  SentActions,
} from "./row-actions";

type Tab = "friends" | "received" | "sent" | "find";

// Module scope: `useUrlState` needs a stable reference.
const DEFAULTS = {
  tab: "friends",
  search: "",
  sort: "recent",
  relationship: "all",
  view: "cards",
  page: "1",
  pageSize: "12",
};

/** What a tab's query produced, reduced to what the shared UI needs. */
type Result = {
  data: Page<PersonRow> | undefined;
  isPending: boolean;
  isFetching: boolean;
  error: unknown;
  refetch: () => unknown;
};

export function FriendsBrowser() {
  const d = useDict();
  const format = useFormat();
  const [state, setState] = useUrlState(DEFAULTS);
  const { data: summary } = useFriendsSummary();

  const tab = (
    ["friends", "received", "sent", "find"].includes(state.tab)
      ? state.tab
      : "friends"
  ) as Tab;

  const paging = {
    search: state.search,
    page: Math.max(1, Number(state.page) || 1),
    pageSize: Math.max(1, Number(state.pageSize) || 12),
  };

  // All four hooks run every render; only the current tab's one is allowed to
  // ask the network. A hook that is not wanted gets `enabled: false` through
  // an empty search (people) or simply is not read (the others are cheap and
  // cached, and share keys with what the tab bar prefetches).
  const friends = useFriends({ ...paging, sort: state.sort as FriendSort });
  const received = useRequests("received", paging);
  const sent = useRequests("sent", paging);
  const people = usePeople({
    ...paging,
    relationship: state.relationship as RelationshipFilter,
  });

  const goToRequest = (username: string) =>
    setState({ tab: "received", search: username, page: "1" });

  const asRows: Record<Tab, Result> = {
    friends: {
      ...friends,
      data: friends.data && {
        total: friends.data.total,
        items: friends.data.items.map((friend) => ({
          id: friend.friendshipId,
          user: friend.user,
          meta: format.date(friend.since),
          actions: <FriendActions friend={friend} />,
        })),
      },
    },
    received: requestRows(received, "received"),
    sent: requestRows(sent, "sent"),
    find: {
      ...people,
      data: people.data && {
        total: people.data.total,
        items: people.data.items.map((person) => ({
          id: person.id,
          user: person,
          meta: d.friends.relationship[person.relationship],
          actions: <PersonActions person={person} onViewRequest={goToRequest} />,
        })),
      },
    },
  };

  function requestRows(
    query: ReturnType<typeof useRequests>,
    kind: RequestKind,
  ): Result {
    return {
      ...query,
      data: query.data && {
        total: query.data.total,
        items: query.data.items.map((request) => ({
          id: request.requestId,
          user: request.user,
          meta: format.relativeTime(request.createdAt),
          actions:
            kind === "received" ? (
              <ReceivedActions request={request} />
            ) : (
              <SentActions request={request} />
            ),
        })),
      },
    };
  }

  const current = asRows[tab];
  const typed = state.search.trim().length > 0;
  const isFiltered =
    typed ||
    (tab === "friends" && state.sort !== DEFAULTS.sort) ||
    (tab === "find" && state.relationship !== DEFAULTS.relationship);

  const setFilters = (patch: Record<string, string>) =>
    setState({ ...patch, page: "1" });

  const sortOptions: SelectOption[] = [
    { value: "recent", label: d.friends.toolbar.recent },
    { value: "name", label: d.friends.toolbar.nameAz },
  ];
  const relationshipOptions: SelectOption[] = [
    { value: "all", label: d.friends.toolbar.anyone },
    { value: "none", label: d.friends.relationship.none },
    { value: "friends", label: d.friends.relationship.friends },
    { value: "sent", label: d.friends.relationship.sent },
    { value: "received", label: d.friends.relationship.received },
  ];

  const metaHeader = {
    friends: d.friends.table.since,
    received: d.friends.table.requested,
    sent: d.friends.table.requested,
    find: d.friends.table.relationship,
  }[tab];

  const empty = (() => {
    if (tab === "find" && !typed) {
      return {
        icon: UserPlus,
        title: d.friends.find.promptTitle,
        body: d.friends.find.promptBody,
      };
    }
    if (isFiltered) {
      return {
        icon: SearchX,
        title: d.friends.empty.filteredTitle,
        body: d.friends.empty.filteredBody,
      };
    }
    return {
      icon: Users,
      title: d.friends.empty[tab].title,
      body: d.friends.empty[tab].body,
    };
  })();

  // The "find" tab has nothing to show, and nothing to fetch, until a name is typed.
  const waiting = tab === "find" && !typed;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {d.friends.title}
        </h1>
        <p className="text-pretty text-muted-foreground">
          {d.friends.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Tabs
          label={d.friends.tabsLabel}
          value={tab}
          onChange={(next) =>
            // Each tab has its own filters, so none carry over.
            setState({
              tab: next,
              search: "",
              sort: "recent",
              relationship: "all",
              page: "1",
            })
          }
          items={[
            {
              id: "friends",
              label: d.friends.tabs.friends,
              count: summary?.friends,
            },
            {
              id: "received",
              label: d.friends.tabs.received,
              count: summary?.received,
            },
            { id: "sent", label: d.friends.tabs.sent, count: summary?.sent },
            { id: "find", label: d.friends.tabs.find },
          ]}
        />

        <ListToolbar
          search={state.search}
          onSearch={(search) => setFilters({ search })}
          placeholder={
            tab === "find"
              ? d.friends.toolbar.findPlaceholder
              : d.friends.toolbar.searchPlaceholder
          }
          view={state.view}
          onView={(view) => setState({ view })}
          isFiltered={isFiltered}
          onReset={() =>
            setState({ search: "", sort: "recent", relationship: "all", page: "1" })
          }
        >
          {tab === "friends" && (
            <Select
              className="w-full sm:w-52"
              aria-label={d.friends.toolbar.sort}
              options={sortOptions}
              value={sortOptions.find((option) => option.value === state.sort)}
              onChange={(option) => option && setFilters({ sort: option.value })}
              isSearchable={false}
            />
          )}
          {tab === "find" && (
            <Select
              className="w-full sm:w-52"
              aria-label={d.friends.toolbar.relationship}
              options={relationshipOptions}
              value={relationshipOptions.find(
                (option) => option.value === state.relationship,
              )}
              onChange={(option) =>
                option && setFilters({ relationship: option.value })
              }
              isSearchable={false}
            />
          )}
        </ListToolbar>

        {waiting || current.data?.items.length === 0 ? (
          <ListMessage {...empty} />
        ) : current.isPending ? (
          <PeopleSkeleton view={state.view} />
        ) : !current.data ? (
          // Only when there is nothing to show: a failed refresh keeps the
          // cached list on screen, and the banner explains why.
          <ListMessage
            icon={TriangleAlert}
            tone="warning"
            title={d.friends.error.title}
            body={
              isApiError(current.error) ? current.error.message : d.friends.error.body
            }
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => void current.refetch()}
              disabled={current.isFetching}
            >
              {d.common.tryAgain}
            </Button>
          </ListMessage>
        ) : (
          <div
            className={cn(
              "transition-opacity",
              current.isFetching && "pointer-events-none opacity-60",
            )}
          >
            <PeopleList
              rows={current.data.items}
              view={state.view}
              metaHeader={metaHeader}
            />
          </div>
        )}

        {!waiting && current.data && (
          <Pagination
            page={paging.page}
            pageSize={paging.pageSize}
            totalItems={current.data.total}
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

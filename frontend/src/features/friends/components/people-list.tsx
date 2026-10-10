"use client";

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { useDict } from "@/i18n/client";

import type { PublicUser } from "../types";

/** One person in a list, whichever tab it is: who, a line about them, what you can do. */
export type PersonRow = {
  id: string;
  user: PublicUser;
  meta: React.ReactNode;
  actions: React.ReactNode;
};

function Bio({ bio }: { bio: string | null }) {
  const d = useDict();
  return bio ? (
    <>{bio}</>
  ) : (
    <span className="italic opacity-70">{d.friends.noBio}</span>
  );
}

function PersonCard({ row }: { row: PersonRow }) {
  return (
    <article className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-black/[0.05] dark:hover:shadow-black/25">
      <div className="flex items-center gap-4">
        <Avatar
          src={row.user.avatarUrl}
          name={row.user.username}
          className="size-14 text-lg"
        />
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{row.user.username}</h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {row.meta}
          </p>
        </div>
      </div>

      <p className="line-clamp-2 min-h-10 text-sm text-pretty text-muted-foreground">
        <Bio bio={row.user.bio} />
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {row.actions}
      </div>
    </article>
  );
}

/**
 * Cards or a table, the same rows either way. `metaHeader` titles the column
 * that holds each tab's own line ("Friends since", "Requested", …).
 */
export function PeopleList({
  rows,
  view,
  metaHeader,
}: {
  rows: PersonRow[];
  view: string;
  metaHeader: string;
}) {
  const d = useDict();

  if (view !== "table") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <PersonCard key={row.id} row={row} />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{d.friends.table.person}</TableHeaderCell>
          <TableHeaderCell className="hidden lg:table-cell">
            {d.friends.table.bio}
          </TableHeaderCell>
          <TableHeaderCell className="hidden sm:table-cell">
            {metaHeader}
          </TableHeaderCell>
          <TableHeaderCell className="text-end">
            <span className="sr-only">{d.friends.table.actions}</span>
          </TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar src={row.user.avatarUrl} name={row.user.username} />
                <span className="truncate font-medium">
                  {row.user.username}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden max-w-xs truncate text-muted-foreground lg:table-cell">
              <Bio bio={row.user.bio} />
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {row.meta}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {row.actions}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Stand-in shapes while a list loads, matching the view that will replace them. */
export function PeopleSkeleton({ view }: { view: string }) {
  if (view === "table") {
    return (
      <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-12" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <Skeleton key={index} className="h-44 rounded-xl" />
      ))}
    </div>
  );
}

/** Empty, error and "type something" states share one dashed panel. */
export function ListMessage({
  icon: Icon,
  title,
  body,
  tone = "muted",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tone?: "muted" | "warning";
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center">
      <span
        className={
          tone === "warning"
            ? "flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground"
        }
      >
        <Icon className="size-5" />
      </span>
      <p className="font-medium">{title}</p>
      <p className="max-w-sm text-sm text-pretty text-muted-foreground">
        {body}
      </p>
      {children}
    </div>
  );
}

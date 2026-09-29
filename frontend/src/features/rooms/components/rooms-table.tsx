"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { routes } from "@/config/routes";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { Room } from "../types";

export function RoomsTable({ rooms }: { rooms: Room[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>Room</TableHeaderCell>
          <TableHeaderCell className="hidden md:table-cell">
            Subject
          </TableHeaderCell>
          <TableHeaderCell className="hidden lg:table-cell">
            Owner
          </TableHeaderCell>
          <TableHeaderCell className="text-right">People</TableHeaderCell>
          <TableHeaderCell className="hidden sm:table-cell">
            Last active
          </TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>
              <Link
                href={routes.room(room.code)}
                className="font-medium transition-colors hover:text-primary"
              >
                {room.name}
              </Link>
              <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                {room.code}
              </span>
            </TableCell>

            <TableCell className="hidden text-muted-foreground md:table-cell">
              {room.subject}
            </TableCell>

            <TableCell className="hidden text-muted-foreground lg:table-cell">
              @{room.ownerUsername}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {room.participantCount}
            </TableCell>

            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {room.lastActiveAt ? formatRelativeTime(room.lastActiveAt) : "—"}
            </TableCell>

            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  room.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    room.status === "active"
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/60",
                  )}
                />
                {room.status === "active" ? "Active" : "Archived"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { useDict } from "@/i18n/client";
import { useFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { Room } from "../types";
import { useSubjectLabel } from "../subject-label";
import { RoomLink } from "./room-link";

export function RoomsTable({ rooms }: { rooms: Room[] }) {
  const d = useDict();
  const { relativeTime } = useFormat();
  const subjectLabel = useSubjectLabel();

  return (
    <Table>
      <TableHead>
        <TableRow className="hover:bg-transparent">
          <TableHeaderCell>{d.rooms.table.room}</TableHeaderCell>
          <TableHeaderCell className="hidden md:table-cell">
            {d.rooms.table.subject}
          </TableHeaderCell>
          <TableHeaderCell className="hidden lg:table-cell">
            {d.rooms.table.owner}
          </TableHeaderCell>
          <TableHeaderCell className="text-end">
            {d.rooms.table.people}
          </TableHeaderCell>
          <TableHeaderCell className="hidden sm:table-cell">
            {d.rooms.table.lastActive}
          </TableHeaderCell>
          <TableHeaderCell>{d.rooms.table.status}</TableHeaderCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>
              <RoomLink
                room={room}
                className="font-medium transition-colors hover:text-primary"
              >
                {room.name}
              </RoomLink>
              {room.inviteCode && (
                <span className="mt-0.5 block font-mono text-xs text-muted-foreground uppercase">
                  {room.inviteCode}
                </span>
              )}
            </TableCell>

            <TableCell className="hidden text-muted-foreground md:table-cell">
              {subjectLabel(room.subject)}
            </TableCell>

            <TableCell className="hidden text-muted-foreground lg:table-cell">
              @{room.ownerUsername}
            </TableCell>

            <TableCell className="text-end tabular-nums">
              {room.participantCount}
            </TableCell>

            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {room.lastActiveAt ? relativeTime(room.lastActiveAt) : "—"}
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
                {room.status === "active"
                  ? d.rooms.status.active
                  : d.rooms.status.archived}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

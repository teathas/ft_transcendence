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
import type { Room } from "../types";
import { useSubjectLabel } from "../subject-label";
import { RoomLink } from "./room-link";
import { RoomStatusPill } from "./room-status-pill";

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
            {d.rooms.table.owner}
          </TableHeaderCell>
          <TableHeaderCell>
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
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {subjectLabel(room.subject)}
              </span>
            </TableCell>

            <TableCell className="hidden text-muted-foreground md:table-cell">
              @{room.ownerUsername}
            </TableCell>

            <TableCell className="tabular-nums">
              {room.participantCount}
            </TableCell>

            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {room.lastActiveAt ? relativeTime(room.lastActiveAt) : "—"}
            </TableCell>

            <TableCell>
              <RoomStatusPill status={room.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

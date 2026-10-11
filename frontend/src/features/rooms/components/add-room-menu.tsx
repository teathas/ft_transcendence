"use client";

import { useState } from "react";
import { Archive, ChevronDown, LogIn, Plus, Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { useDict } from "@/i18n/client";

import { CreateRoomModal } from "./create-room-modal";
import { JoinRoomModal } from "./join-room-modal";

export function AddRoomMenu({
  onFilter,
}: {
  onFilter: (patch: { ownership?: string; status?: string }) => void;
}) {
  const d = useDict();
  const [modal, setModal] = useState<"create" | "join" | null>(null);

  return (
    <>
      {/* Split button: the primary action, plus everything adjacent to it. */}
      <div className="flex">
        <Button className="rounded-e-none" onClick={() => setModal("create")}>
          <Plus className="size-4" aria-hidden="true" />
          {d.rooms.addMenu.addRoom}
        </Button>

        <Dropdown
          label={d.rooms.addMenu.more}
          trigger={(triggerProps) => (
            <Button
              {...triggerProps}
              aria-label={d.rooms.addMenu.more}
              className="rounded-s-none border-s border-primary-foreground/25 px-2"
            >
              <ChevronDown className="size-4" aria-hidden="true" />
            </Button>
          )}
        >
          <DropdownItem
            onClick={() => {
              setModal("join");
            }}
          >
            <LogIn className="size-4" aria-hidden="true" />
            {d.rooms.addMenu.joinWithCode}
          </DropdownItem>

          <DropdownSeparator />
          <DropdownLabel>{d.rooms.addMenu.jumpTo}</DropdownLabel>

          <DropdownItem
            onClick={() => {
              onFilter({ ownership: "owned", status: "all" });
            }}
          >
            <Star className="size-4" aria-hidden="true" />
            {d.rooms.addMenu.roomsIOwn}
          </DropdownItem>

          <DropdownItem
            onClick={() => {
              onFilter({ ownership: "joined", status: "all" });
            }}
          >
            <Users className="size-4" aria-hidden="true" />
            {d.rooms.addMenu.roomsIJoined}
          </DropdownItem>

          <DropdownItem
            onClick={() => {
              onFilter({ ownership: "all", status: "archived" });
            }}
          >
            <Archive className="size-4" aria-hidden="true" />
            {d.rooms.addMenu.archivedRooms}
          </DropdownItem>
        </Dropdown>
      </div>

      <CreateRoomModal
        open={modal === "create"}
        onClose={() => setModal(null)}
      />
      <JoinRoomModal open={modal === "join"} onClose={() => setModal(null)} />
    </>
  );
}

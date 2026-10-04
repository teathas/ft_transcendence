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

import { CreateRoomModal } from "./create-room-modal";
import { JoinRoomModal } from "./join-room-modal";

export function AddRoomMenu({
  onFilter,
}: {
  onFilter: (patch: { ownership?: string; status?: string }) => void;
}) {
  const [modal, setModal] = useState<"create" | "join" | null>(null);

  return (
    <>
      {/* Split button: the primary action, plus everything adjacent to it. */}
      <div className="flex">
        <Button className="rounded-r-none" onClick={() => setModal("create")}>
          <Plus className="size-4" aria-hidden="true" />
          Add room
        </Button>

        <Dropdown
          label="More room actions"
          trigger={(triggerProps) => (
            <Button
              {...triggerProps}
              aria-label="More room actions"
              className="rounded-l-none border-l border-primary-foreground/25 px-2"
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
            Join a room with a code
          </DropdownItem>

          <DropdownSeparator />
          <DropdownLabel>Jump to</DropdownLabel>

          <DropdownItem
            onClick={() => {
              onFilter({ ownership: "owned", status: "all" });
            }}
          >
            <Star className="size-4" aria-hidden="true" />
            Rooms I own
          </DropdownItem>

          <DropdownItem
            onClick={() => {
              onFilter({ ownership: "joined", status: "all" });
            }}
          >
            <Users className="size-4" aria-hidden="true" />
            Rooms I joined
          </DropdownItem>

          <DropdownItem
            onClick={() => {
              onFilter({ ownership: "all", status: "archived" });
            }}
          >
            <Archive className="size-4" aria-hidden="true" />
            Archived rooms
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

"use client";

import { FileText, MessageSquare, Users } from "lucide-react";

import { useDict } from "@/i18n/client";
import { cn } from "@/lib/utils";

import { ChatPanel } from "./chat-panel";
import { FilesPanel } from "./files-panel";
import { PeoplePanel } from "./people-panel";

export const RAIL_TABS = [
  { id: "chat", icon: MessageSquare },
  { id: "files", icon: FileText },
  { id: "people", icon: Users },
] as const;

export type RailTab = (typeof RAIL_TABS)[number]["id"];

export function RoomRail({
  roomCode,
  tab,
  onTabChange,
}: {
  roomCode: string;
  tab: RailTab;
  onTabChange: (tab: RailTab) => void;
}) {
  const d = useDict();

  return (
    <>
      <div role="tablist" aria-label={d.room.tabs} className="flex border-b">
        {RAIL_TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors",
              tab === id
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {d.room[id]}
          </button>
        ))}
      </div>

      {tab === "chat" && <ChatPanel roomCode={roomCode} />}
      {tab === "files" && <FilesPanel roomCode={roomCode} />}
      {tab === "people" && <PeoplePanel roomCode={roomCode} />}
    </>
  );
}

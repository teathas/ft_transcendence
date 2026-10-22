"use client";

import { useState } from "react";
import { ArrowLeft, Check, Menu, PanelRight } from "lucide-react";

import { useNavDrawer } from "@/components/layout/app-shell";
import { BellLink } from "@/components/layout/bell-link";
import { Button, buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useDict } from "@/i18n/client";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

import { useSubjectLabel } from "../../subject-label";
import type { Room } from "../../types";
import type { SyncStatus } from "./board-synced";
import { ROOM_PANELS, type RoomPanel } from "./room-panels";
import { SyncBadge } from "./sync-badge";

export function RoomHeader({
  room,
  syncStatus,
  panel,
  onToggle,
  counts,
  panelOpen,
  onTogglePanel,
}: {
  room: Room;
  syncStatus: SyncStatus;
  panel: RoomPanel | null;
  onToggle: (panel: RoomPanel) => void;
  counts: Partial<Record<RoomPanel, number>>;
  panelOpen: boolean;
  onTogglePanel: () => void;
}) {
  const d = useDict();
  const subjectLabel = useSubjectLabel();
  const nav = useNavDrawer();
  const [copied, setCopied] = useState(false);
  const unread = counts.chat ?? 0;
  const panelLabel = panelOpen ? d.room.hidePanel : d.room.showPanel;

  async function copyCode() {
    if (!room.inviteCode) return;
    try {
      await navigator.clipboard.writeText(room.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code is still in the People panel.
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-2 sm:gap-3 sm:px-4">
      {/* Focus mode: the sidebar is hidden in a room, at every size. */}
      <button
        type="button"
        onClick={nav.open}
        aria-expanded={nav.isOpen}
        aria-controls="app-drawer"
        aria-label={d.nav.openNavigation}
        title={d.nav.openNavigation}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <Link
        href={routes.dashboard}
        className={buttonStyles({
          variant: "outline",
          className: "h-11 max-sm:w-11 max-sm:px-0",
        })}
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {/* Phones keep the arrow only; the words stay for screen readers. */}
        <span className="max-sm:sr-only">{d.room.leave}</span>
      </Link>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold sm:text-base">
          {room.name}
        </h1>
        <p className="truncate text-xs text-muted-foreground">
          {subjectLabel(room.subject)} · <bdi>@{room.ownerUsername}</bdi>
        </p>
      </div>

      <SyncBadge status={syncStatus} />

      {room.inviteCode && (
        <Button
          onClick={copyCode}
          title={d.room.copyCode}
          className="hidden h-11 px-4 sm:inline-flex"
        >
          {copied && <Check className="size-4" aria-hidden="true" />}
          {copied ? d.room.copied : d.room.invite}
        </Button>
      )}
      {/* Says "Code copied" to screen readers, which do not see the label change. */}
      <span role="status" className="sr-only">
        {copied ? d.room.copied : ""}
      </span>

      <BellLink />

      {/* Tablets and up: one button for the side panel; phones keep the icons. */}
      <button
        type="button"
        onClick={onTogglePanel}
        aria-expanded={panelOpen}
        aria-controls="room-panel"
        aria-label={
          !panelOpen && unread
            ? `${panelLabel}, ${t(d.room.unreadChat, { count: unread })}`
            : panelLabel
        }
        title={panelLabel}
        className="relative hidden size-11 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
      >
        <PanelRight className="size-5 rtl:rotate-180" aria-hidden="true" />
        {!panelOpen && unread ? (
          <span
            aria-hidden="true"
            className="absolute -end-1.5 -top-1.5 min-w-5 rounded-full bg-primary px-1 text-center text-[11px] leading-5 font-medium text-primary-foreground tabular-nums"
          >
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {/* Phones: the dock's three buttons, as icons. */}
      <div className="flex items-center md:hidden">
        {ROOM_PANELS.map(({ id, icon: Icon }) => {
          const count = counts[id];
          return (
            <Button
              key={id}
              variant="ghost"
              size="icon"
              data-panel={id}
              aria-pressed={panel === id}
              aria-label={t(d.room.openPanel, { panel: d.room[id] })}
              onClick={() => onToggle(id)}
              className={cn("relative", panel === id && "bg-accent")}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {count && id === "chat" ? (
                <span className="absolute end-1 top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] leading-4 font-semibold text-primary-foreground">
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
            </Button>
          );
        })}
      </div>
    </header>
  );
}

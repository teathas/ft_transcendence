import type { Metadata } from "next";

import { getDict } from "@/i18n/server";

import { RoomWorkspace } from "@/features/rooms/components/room/room-workspace";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.room.metaTitle };
}

export default async function RoomPage({
  params,
}: PageProps<"/[lang]/rooms/[id]">) {
  const { id } = await params;

  return <RoomWorkspace id={id} />;
}

import type { Metadata } from "next";

import { getDict } from "@/i18n/server";
import { t } from "@/i18n/translate";

import { RoomWorkspace } from "@/features/rooms/components/room/room-workspace";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/rooms/[code]">): Promise<Metadata> {
  const { code } = await params;
  const d = await getDict();
  return { title: t(d.room.metaTitle, { code }) };
}

export default async function RoomPage({
  params,
}: PageProps<"/[lang]/rooms/[code]">) {
  const { code } = await params;

  return <RoomWorkspace code={code} />;
}

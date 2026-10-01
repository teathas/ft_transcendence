import type { Metadata } from "next";

import { RoomWorkspace } from "@/features/rooms/components/room/room-workspace";

export async function generateMetadata({
  params,
}: PageProps<"/rooms/[code]">): Promise<Metadata> {
  const { code } = await params;
  return { title: `Room ${code}` };
}

export default async function RoomPage({ params }: PageProps<"/rooms/[code]">) {
  const { code } = await params;

  return <RoomWorkspace code={code} />;
}

import { Thread } from "@/features/messages/components/thread";

export default async function ThreadPage({
  params,
}: PageProps<"/[lang]/messages/[friendId]">) {
  const { friendId } = await params;
  // Keyed, so a different friend starts with a clean scroll and composer.
  return <Thread key={friendId} friendId={friendId} />;
}

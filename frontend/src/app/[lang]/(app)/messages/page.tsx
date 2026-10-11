import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";

import { getDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.messages.metaTitle, description: d.messages.metaDescription };
}

/** Shown beside the list on a wide screen until a conversation is picked. */
export default async function MessagesPage() {
  const d = await getDict();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessagesSquare className="size-6" aria-hidden="true" />
      </span>
      <p className="font-medium">{d.messages.choose.title}</p>
      <p className="max-w-xs text-sm text-pretty text-muted-foreground">
        {d.messages.choose.body}
      </p>
    </div>
  );
}

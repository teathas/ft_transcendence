import { getDict } from "@/i18n/server";
import { t } from "@/i18n/translate";
import { cn } from "@/lib/utils";

import { CHAT_MESSAGES } from "../../content";

export async function RoomChat({ className }: { className?: string }) {
  const d = await getDict();

  return (
    <div className={cn("flex flex-col gap-3 p-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">{d.landing.showcase.chatTitle}</p>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {t(d.landing.showcase.online, { count: 3 })}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {CHAT_MESSAGES.map((message) => (
          <li key={message.time} className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[11px] font-semibold"
                style={{ color: message.color }}
              >
                {message.author.split(" ")[0]}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {message.time}
              </span>
            </div>
            <p className="rounded-lg rounded-ss-sm bg-muted/60 px-2.5 py-1.5 text-[11px] leading-snug">
              {d.landing.showcase.messages[message.key]}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { FileImage, FileText } from "lucide-react";

import { getDict } from "@/i18n/server";
import { cn } from "@/lib/utils";

import { ROOM_FILES } from "../../content";

export async function RoomFiles({ className }: { className?: string }) {
  const d = await getDict();

  return (
    <div className={cn("flex flex-col gap-3 p-4", className)}>
      <p className="text-xs font-semibold">{d.landing.showcase.files}</p>

      <ul className="flex flex-col gap-2">
        {ROOM_FILES.map((file) => {
          const Icon = file.kind === "pdf" ? FileText : FileImage;
          return (
            <li
              key={file.name}
              className="flex items-center gap-2.5 rounded-lg border bg-muted/50 px-2.5 py-2"
            >
              <Icon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-medium">
                  {file.name}
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  {file.meta}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { cn } from "@/lib/utils";

import { PARTICIPANTS } from "../../content";

export function AvatarStack({ className }: { className?: string }) {
  return (
    <div className={cn("flex -space-x-2", className)}>
      {PARTICIPANTS.map((participant) => (
        <span
          key={participant.name}
          title={`${participant.name} · ${participant.role}`}
          className="inline-flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-card"
          style={{ backgroundColor: participant.color }}
        >
          {participant.initials}
        </span>
      ))}
    </div>
  );
}

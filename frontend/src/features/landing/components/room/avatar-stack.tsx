import { getDict } from "@/i18n/server";
import { cn } from "@/lib/utils";

import { PARTICIPANTS } from "../../content";

export async function AvatarStack({ className }: { className?: string }) {
  const d = await getDict();
  const roles = {
    Teacher: d.landing.classroom.roles.teacher,
    Student: d.landing.classroom.roles.student,
  };

  return (
    <div className={cn("flex -space-x-2 rtl:space-x-reverse", className)}>
      {PARTICIPANTS.map((participant) => (
        <span
          key={participant.name}
          title={`${participant.name} · ${roles[participant.role]}`}
          className="inline-flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-card"
          style={{ backgroundColor: participant.color }}
        >
          {participant.initials}
        </span>
      ))}
    </div>
  );
}

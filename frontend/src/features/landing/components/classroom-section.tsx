import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  MousePointer2,
  Paperclip,
  Presentation,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { getDict } from "@/i18n/server";
import { t } from "@/i18n/translate";

import { PARTICIPANTS } from "../content";

export async function ClassroomSection() {
  const d = await getDict();
  const [teacher, student] = PARTICIPANTS;

  const audiences = [
    { icon: Presentation, label: d.landing.classroom.audiences.teachers },
    { icon: GraduationCap, label: d.landing.classroom.audiences.students },
    { icon: BookOpen, label: d.landing.classroom.audiences.tutors },
    { icon: UsersRound, label: d.landing.classroom.audiences.studyGroups },
    {
      icon: MousePointer2,
      label: d.landing.classroom.audiences.remoteTeams,
    },
  ];

  const studentActions = [
    { icon: Presentation, label: d.landing.classroom.actions.watch },
    { icon: MousePointer2, label: d.landing.classroom.actions.tryIt },
    { icon: MessageSquare, label: d.landing.classroom.actions.ask },
    { icon: Paperclip, label: d.landing.classroom.actions.openSheet },
  ];

  return (
    <section
      id="classroom"
      className="scroll-mt-20 border-y bg-muted/40 py-20 sm:py-28"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {d.landing.classroom.title}
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
            {d.landing.classroom.subtitle}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {audiences.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium"
              >
                <Icon className="size-3.5 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: teacher.color }}
            >
              {teacher.initials}
            </span>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                {/* A person's name keeps its own direction inside Arabic text. */}
                <span dir="ltr">{teacher.name}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {d.landing.classroom.roles.teacher}
                </span>
              </p>
              <p className="mt-1.5 text-base font-medium text-pretty">
                {d.landing.classroom.quote}
              </p>
            </div>
          </div>

          <div className="my-5 rounded-xl border bg-background [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px] p-4 text-center">
            <p className="font-mono text-lg font-semibold" dir="ltr">
              x² + 2x + 1 = 0
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(d.landing.classroom.writing, {
                name: teacher.name.split(" ")[0],
              })}
            </p>
          </div>

          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t(d.landing.classroom.whileOthers, {
              name: student.name.split(" ")[0],
            })}
          </p>
          <ul className="mt-3 grid gap-2.5">
            {studentActions.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

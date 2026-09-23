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

import { PARTICIPANTS } from "../content";

const AUDIENCES = [
  { icon: Presentation, label: "Teachers" },
  { icon: GraduationCap, label: "Students" },
  { icon: BookOpen, label: "Tutors" },
  { icon: UsersRound, label: "Study groups" },
  { icon: MousePointer2, label: "Remote teams" },
];

const STUDENT_ACTIONS = [
  { icon: Presentation, label: "Watch the explanation as it is drawn" },
  { icon: MousePointer2, label: "Step onto the board and try it themselves" },
  { icon: MessageSquare, label: "Ask a question without interrupting" },
  { icon: Paperclip, label: "Pull up the exercise sheet in one click" },
];

export function ClassroomSection() {
  const [teacher, student] = PARTICIPANTS;

  return (
    <section
      id="classroom"
      className="scroll-mt-20 border-y bg-muted/40 py-20 sm:py-28"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            A classroom without the walls.
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
            Everyone opens the same link and lands in the same room — whether
            they are in a lecture hall, a library or at their kitchen table.
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {AUDIENCES.map(({ icon: Icon, label }) => (
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
                {teacher.name}
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {teacher.role}
                </span>
              </p>
              <p className="mt-1.5 text-base font-medium text-pretty">
                “Let’s solve this equation together.”
              </p>
            </div>
          </div>

          <div className="my-5 rounded-xl border bg-background [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px] p-4 text-center">
            <p className="font-mono text-lg font-semibold">x² + 2x + 1 = 0</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {teacher.name.split(" ")[0]} is writing on the board…
            </p>
          </div>

          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            While {student.name.split(" ")[0]} and the others can
          </p>
          <ul className="mt-3 grid gap-2.5">
            {STUDENT_ACTIONS.map(({ icon: Icon, label }) => (
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

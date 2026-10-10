import {
  BookOpen,
  GraduationCap,
  Presentation,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/layout/container";

const USE_CASES = [
  {
    icon: Presentation,
    title: "Online classes",
    description:
      "Teachers explain concepts on an interactive shared whiteboard the whole class can follow and join in on.",
  },
  {
    icon: UsersRound,
    title: "Study groups",
    description:
      "Students work through problem sets together, each one able to pick up the pen.",
  },
  {
    icon: BookOpen,
    title: "Private tutoring",
    description:
      "A tutor and a student share one canvas, so corrections happen in the moment instead of over email.",
  },
  {
    icon: GraduationCap,
    title: "Team workshops",
    description:
      "Remote teams brainstorm on an infinite canvas and keep the notes, sketches and files in one room.",
  },
];

export function UseCases() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Built for the way people actually teach.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-semibold tracking-tight">{title}</h3>
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

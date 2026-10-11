import {
  BookOpen,
  GraduationCap,
  Presentation,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { getDict } from "@/i18n/server";

export async function UseCases() {
  const d = await getDict();

  const useCases = [
    {
      icon: Presentation,
      title: d.landing.useCases.classes.title,
      description: d.landing.useCases.classes.description,
    },
    {
      icon: UsersRound,
      title: d.landing.useCases.studyGroups.title,
      description: d.landing.useCases.studyGroups.description,
    },
    {
      icon: BookOpen,
      title: d.landing.useCases.tutoring.title,
      description: d.landing.useCases.tutoring.description,
    },
    {
      icon: GraduationCap,
      title: d.landing.useCases.workshops.title,
      description: d.landing.useCases.workshops.description,
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {d.landing.useCases.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map(({ icon: Icon, title, description }) => (
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

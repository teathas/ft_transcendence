import { Link2, MessageSquare, Pencil } from "lucide-react";

import { Container } from "@/components/layout/container";
import { getDict } from "@/i18n/server";
import { t } from "@/i18n/translate";

import { ROOM_CODE } from "../content";

export async function HowItWorks() {
  const d = await getDict();

  const steps = [
    {
      icon: Link2,
      title: d.landing.howItWorks.create.title,
      description: t(d.landing.howItWorks.create.description, {
        code: ROOM_CODE,
      }),
    },
    {
      icon: Pencil,
      title: d.landing.howItWorks.collaborate.title,
      description: d.landing.howItWorks.collaborate.description,
    },
    {
      icon: MessageSquare,
      title: d.landing.howItWorks.communicate.title,
      description: d.landing.howItWorks.communicate.description,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y bg-muted/40 py-20 sm:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {d.landing.howItWorks.title}
          </h2>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="relative flex flex-col gap-3 rounded-2xl border bg-card p-6"
            >
              <span className="absolute end-6 top-5 font-mono text-4xl font-bold text-muted-foreground/40 tabular-nums">
                {index + 1}
              </span>

              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <h3 className="font-semibold tracking-tight">{title}</h3>
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

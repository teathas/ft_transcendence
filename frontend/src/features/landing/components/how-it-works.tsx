import { Link2, MessageSquare, Pencil } from "lucide-react";

import { Container } from "@/components/layout/container";

import { ROOM_CODE } from "../content";

const STEPS = [
  {
    icon: Link2,
    title: "Create or join a room",
    description: `Start a room and invite others with a link or a code like ${ROOM_CODE}. No install, no account juggling.`,
  },
  {
    icon: Pencil,
    title: "Collaborate",
    description:
      "Write, draw and explain concepts together on the shared whiteboard. Everyone edits the same canvas.",
  },
  {
    icon: MessageSquare,
    title: "Communicate",
    description:
      "Ask questions in chat and share files without ever leaving the room.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y bg-muted/40 py-20 sm:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Up and running in three steps.
          </h2>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="relative flex flex-col gap-3 rounded-2xl border bg-card p-6"
            >
              <span className="absolute top-5 right-6 font-mono text-4xl font-bold text-muted-foreground/40 tabular-nums">
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

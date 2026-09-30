"use client";

import { FileText, MessageSquare, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    icon: Pencil,
    title: "A board everyone can draw on",
    description: "One infinite canvas, shared by the whole room.",
  },
  {
    icon: MessageSquare,
    title: "Chat that stays in context",
    description: "Ask a question without interrupting the explanation.",
  },
  {
    icon: FileText,
    title: "Material within reach",
    description: "Drop a PDF or an image and everyone can open it.",
  },
];

export function WelcomeStep({
  username,
  onNext,
}: {
  username?: string;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Welcome{username ? `, ${username}` : ""} 👋
        </h1>
        <p className="text-pretty text-muted-foreground">
          Shared Room is one room where everyone writes, draws and talks
          together. Two quick steps and you are in.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="flex items-start gap-3 rounded-xl border bg-card p-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4.5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-medium">{title}</span>
              <span className="block text-sm text-pretty text-muted-foreground">
                {description}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <Button size="lg" onClick={onNext}>
        Get started
      </Button>
    </div>
  );
}

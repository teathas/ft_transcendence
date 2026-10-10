"use client";

import { FileText, MessageSquare, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/client";
import { t } from "@/i18n/translate";

export function WelcomeStep({
  username,
  onNext,
}: {
  username?: string;
  onNext: () => void;
}) {
  const d = useDict();

  const highlights = [
    {
      icon: Pencil,
      title: d.onboarding.welcome.board.title,
      description: d.onboarding.welcome.board.description,
    },
    {
      icon: MessageSquare,
      title: d.onboarding.welcome.chat.title,
      description: d.onboarding.welcome.chat.description,
    },
    {
      icon: FileText,
      title: d.onboarding.welcome.files.title,
      description: d.onboarding.welcome.files.description,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {username
            ? t(d.onboarding.welcome.titleNamed, { name: username })
            : d.onboarding.welcome.title}
        </h1>
        <p className="text-pretty text-muted-foreground">
          {d.onboarding.welcome.subtitle}
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {highlights.map(({ icon: Icon, title, description }) => (
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
        {d.onboarding.welcome.submit}
      </Button>
    </div>
  );
}

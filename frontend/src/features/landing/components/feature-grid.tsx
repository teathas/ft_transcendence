import { Fragment } from "react";
import {
  ArrowRight,
  FileText,
  Highlighter,
  MessageSquare,
  MousePointer2,
  Pencil,
  Square,
  Type,
  Users,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { getDict } from "@/i18n/server";
import { cn } from "@/lib/utils";

import { CHAT_MESSAGES, PARTICIPANTS, ROOM_FILES } from "../content";

function FeatureCard({
  icon: Icon,
  title,
  description,
  visual,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  visual: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-black/[0.06] dark:hover:shadow-black/30",
        className,
      )}
    >
      <div className="border-b bg-muted/40 p-5">{visual}</div>

      <div className="flex flex-col gap-2 p-5">
        <h3 className="flex items-center gap-2 font-semibold tracking-tight">
          <Icon className="size-4 text-primary" aria-hidden="true" />
          {title}
        </h3>
        <p className="text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function WhiteboardVisual() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-fit items-center gap-1 rounded-lg border bg-card p-1 shadow-xs">
        {[MousePointer2, Pencil, Square, Type, Highlighter].map(
          (Icon, index) => (
            <span
              key={index}
              className={cn(
                "flex size-6 items-center justify-center rounded-md",
                index === 1
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
          ),
        )}
      </div>

      <div className="relative h-24 overflow-hidden rounded-lg border bg-background [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:14px_14px]">
        <svg
          viewBox="0 0 220 96"
          className="absolute inset-0 size-full"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="16"
            y="20"
            width="56"
            height="38"
            rx="6"
            className="stroke-primary"
            strokeWidth="2"
          />
          <path
            d="M84 40h40"
            className="stroke-muted-foreground"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M118 34l7 6-7 6"
            className="stroke-muted-foreground"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="166"
            cy="40"
            r="21"
            className="stroke-emerald-500"
            strokeWidth="2"
          />
          <path
            d="M24 76c18-10 34 6 52-2s30-10 48-2"
            className="stroke-amber-500"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function RealtimeVisual({
  caption,
  captionAccent,
}: {
  caption: string;
  captionAccent: string;
}) {
  const [teacher, student] = PARTICIPANTS;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {[teacher, student].map((participant, index) => (
          <Fragment key={participant.name}>
            {index === 1 && (
              <ArrowRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <div className="relative h-20 flex-1 overflow-hidden rounded-lg border bg-background">
              <svg
                viewBox="0 0 120 80"
                className="absolute inset-0 size-full"
                fill="none"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M22 54c12-22 26-22 38 0s26 22 38 0"
                  stroke={participant.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="absolute top-1.5 left-1.5 rounded px-1 py-0.5 text-[9px] font-medium text-white"
                style={{ backgroundColor: participant.color }}
              >
                {participant.name.split(" ")[0]}
              </span>
            </div>
          </Fragment>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {caption}{" "}
        <span className="font-medium text-foreground">{captionAccent}</span>
      </p>
    </div>
  );
}

async function ChatVisual() {
  const d = await getDict();

  return (
    <div className="flex flex-col gap-2">
      {CHAT_MESSAGES.slice(0, 3).map((message) => (
        <div key={message.time} className="flex items-start gap-2">
          <span
            className="mt-0.5 size-5 shrink-0 rounded-full text-center text-[9px] leading-5 font-semibold text-white"
            style={{ backgroundColor: message.color }}
          >
            {message.author
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5">
              <span
                className="text-[11px] font-semibold"
                style={{ color: message.color }}
              >
                {message.author.split(" ")[0]}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {message.time}
              </span>
            </p>
            <p className="mt-0.5 truncate rounded-lg border bg-card px-2 py-1 text-[11px]">
              {d.landing.showcase.messages[message.key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FilesVisual({
  sharedLabel,
  dropHint,
}: {
  sharedLabel: string;
  dropHint: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {ROOM_FILES.map((file) => (
        <div
          key={file.name}
          className="flex items-center gap-2.5 rounded-lg border bg-card px-2.5 py-2"
        >
          <FileText
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-medium">
              {file.name}
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {file.meta}
            </span>
          </span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
            {sharedLabel}
          </span>
        </div>
      ))}
      <div className="rounded-lg border border-dashed border-muted-foreground/25 px-2.5 py-2 text-center text-[10px] text-muted-foreground">
        {dropHint}
      </div>
    </div>
  );
}

export async function FeatureGrid() {
  const d = await getDict();

  const features = [
    {
      icon: Pencil,
      title: d.landing.features.whiteboard.title,
      description: d.landing.features.whiteboard.description,
      visual: <WhiteboardVisual />,
    },
    {
      icon: Users,
      title: d.landing.features.realtime.title,
      description: d.landing.features.realtime.description,
      visual: (
        <RealtimeVisual
          caption={d.landing.features.realtime.caption}
          captionAccent={d.landing.features.realtime.captionAccent}
        />
      ),
    },
    {
      icon: MessageSquare,
      title: d.landing.features.chat.title,
      description: d.landing.features.chat.description,
      visual: <ChatVisual />,
    },
    {
      icon: FileText,
      title: d.landing.features.files.title,
      description: d.landing.features.files.description,
      visual: (
        <FilesVisual
          sharedLabel={d.landing.features.files.shared}
          dropHint={d.landing.features.files.dropHint}
        />
      ),
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {d.landing.features.title}
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
            {d.landing.features.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}

import { ArrowRight, Radio } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";

import { RoomMockup } from "./room/room-mockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient light behind the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 lg:py-24">
        <div className="flex animate-fade-up flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
            <Radio className="size-3.5 text-primary" aria-hidden="true" />
            Real-time collaborative classroom
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Learn together.{" "}
            <span className="text-primary">Write together.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-pretty text-muted-foreground sm:text-lg">
            A real-time collaborative classroom where everyone can write, draw,
            chat and share files in the same room.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={routes.createRoom}
              className={buttonStyles({ size: "lg", className: "group" })}
            >
              Create a Room
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href={routes.joinRoom}
              className={buttonStyles({ variant: "outline", size: "lg" })}
            >
              Join a Room
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No setup. Share a link and everyone is on the same board.
          </p>
        </div>

        <div
          className="animate-fade-up lg:-mr-8 xl:-mr-16"
          style={{ animationDelay: "120ms" }}
        >
          <RoomMockup />
        </div>
      </Container>
    </section>
  );
}

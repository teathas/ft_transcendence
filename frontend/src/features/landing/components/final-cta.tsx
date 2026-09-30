import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonStyles } from "@/components/ui/button";
import { routes } from "@/config/routes";

export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000,transparent)] [background-size:44px_44px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Your classroom is one room away.
            </h2>
            <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
              Create a room, invite your classmates and start collaborating in
              real time.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/layout/container";
import { getDict } from "@/i18n/server";

import { RoomMockup } from "./room/room-mockup";

export async function RoomShowcase() {
  const d = await getDict();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {d.landing.showcase.title}
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
            {d.landing.showcase.subtitle}
          </p>
        </div>

        <div className="mt-12">
          <RoomMockup boardClassName="min-h-72 sm:min-h-100" />
        </div>
      </Container>
    </section>
  );
}

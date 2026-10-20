import { Container } from "@/components/layout/container";

type LegalPageProps = {
  title: string;
  description: string;
  intro: string;
  lastUpdated: string;
  sections: { title: string; body: string }[];
};

export function LegalPage({
  title,
  description,
  intro,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <Container className="py-16 sm:py-20 lg:py-24">
      <article className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <p className="text-sm font-medium text-primary">{lastUpdated}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </header>

        <p className="mt-8 text-base leading-7 text-muted-foreground">
          {intro}
        </p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}

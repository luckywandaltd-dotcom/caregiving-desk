import { Container, Section } from "@/components/ui";
import { TipFilter } from "@/components/tip-filter";
import { tips } from "@/content/tips";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Small tips for everyday care",
  "Browse Caregiving Desk topics for aging well and supporting an older parent. Current articles are clearly labeled example content awaiting fact-checking.",
  "/tips",
);

export default function TipsPage() {
  const newestFirst = [...tips].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  return (
    <>
      <Section className="border-b border-border bg-sage/50">
        <Container>
          <p className="mb-5 font-bold uppercase tracking-[0.14em] text-forest">
            The reading corner
          </p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            Small reads.
            <br />
            Care-filled days.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
            Simple topics for older adults and the people who care for them. Take a
            moment, choose a topic, and make yourself at home.
          </p>
          {tips.some((tip) => tip.example) && (
            <p className="mt-6 max-w-2xl rounded-xl border border-border bg-paper p-4 text-ink">
              Articles marked “EXAMPLE CONTENT” demonstrate the layout. They are not
              health guidance and must be replaced and fact-checked before launch.
            </p>
          )}
        </Container>
      </Section>
      <Section>
        <Container>
          <h2 className="sr-only">Browse tips by topic</h2>
          <TipFilter tips={newestFirst} />
        </Container>
      </Section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { TipEmbed } from "@/components/tip-embed";
import { getTip, tips } from "@/content/tips";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tips.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tip = getTip(slug);
  if (!tip) notFound();
  const metadata = pageMetadata(tip.title, tip.summary, `/tips/${slug}`);
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article" as const,
      ...(tip.example ? {} : { publishedTime: tip.publishedAt }),
    },
  };
}

function trustedSourceUrl(value: string) {
  try {
    const url = new URL(value);
    const allowed = ["cdc.gov", "nih.gov", "mayoclinic.org", "nhs.uk"].some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
    return url.protocol === "https:" && allowed && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export default async function TipPage({ params }: Props) {
  const { slug } = await params;
  const tip = getTip(slug);
  if (!tip) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: tip.title,
          description: tip.summary,
          image: absoluteUrl(tip.image),
          url: absoluteUrl(`/tips/${tip.slug}`),
          mainEntityOfPage: absoluteUrl(`/tips/${tip.slug}`),
          articleSection: tip.category,
          author: {
            "@type": "Organization",
            name: "Caregiving Desk",
            url: absoluteUrl("/about"),
          },
          publisher: {
            "@type": "Organization",
            name: "Caregiving Desk",
            url: absoluteUrl("/"),
          },
          ...(tip.example ? {} : { datePublished: tip.publishedAt }),
        }}
      />
      <Section>
        <Container>
          <article className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-7 text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/tips"
                    className="inline-flex min-h-12 items-center underline underline-offset-4"
                  >
                    Tips
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{tip.category}</li>
              </ol>
            </nav>
            <p className="font-bold text-forest">{tip.category}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              {tip.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted">{tip.summary}</p>
            {tip.example && (
              <aside
                className="mt-7 rounded-xl border border-border bg-sage p-5 text-ink"
                aria-label="Example content notice"
              >
                <p className="font-bold">EXAMPLE CONTENT – replace before launch</p>
                <p className="mt-2">
                  This page demonstrates the article layout. It does not contain reviewed
                  health guidance.
                </p>
              </aside>
            )}
            <Image
              src={tip.image}
              alt={tip.imageAlt}
              width={960}
              height={660}
              className="mt-9 aspect-[16/11] w-full rounded-2xl border border-border object-cover"
              sizes="(max-width: 767px) 100vw, 768px"
              priority
            />
            <section className="mt-10" aria-labelledby="tip-points">
              <h2 id="tip-points" className="font-serif text-3xl text-ink">
                A few simple points
              </h2>
              <ol className="mt-6 space-y-6">
                {tip.points.map((point, index) => (
                  <li key={point} className="flex items-start gap-5">
                    <span
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sage font-serif text-2xl text-forest"
                    >
                      {index + 1}
                    </span>
                    <p className="pt-2 text-muted">{point}</p>
                  </li>
                ))}
              </ol>
            </section>
            <aside
              className="mt-10 rounded-2xl border border-border bg-sage p-6 sm:p-8"
              aria-labelledby="safety-note"
            >
              <h2 id="safety-note" className="font-serif text-2xl text-ink">
                Safety note: talk to your doctor if…
              </h2>
              <p className="mt-4 text-ink">{tip.safetyNote}</p>
              <p className="mt-4 text-ink">
                Content is for education only and is not medical advice.
              </p>
            </aside>
            {tip.embedUrl && (
              <div className="mt-10">
                <TipEmbed url={tip.embedUrl} title={tip.title} />
              </div>
            )}
            <section
              className="mt-10 border-t border-border pt-8"
              aria-labelledby="tip-sources"
            >
              <h2 id="tip-sources" className="font-serif text-3xl text-ink">
                Sources & further reading
              </h2>
              {tip.example && (
                <p className="mt-4 text-muted">
                  Source fields below are placeholders. Add the specific reviewed articles
                  that support the final tip before publishing.
                </p>
              )}
              <ul className="mt-5 space-y-3">
                {tip.sources.map((source) => {
                  const href = trustedSourceUrl(source.url);
                  return (
                    <li key={`${source.label}-${source.url}`} className="break-words">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 items-center gap-2 text-forest underline underline-offset-4"
                        >
                          {source.label}
                          <span aria-hidden="true">→</span>
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <p className="rounded-lg border border-border bg-paper p-4 text-muted">
                          {source.label}
                          <br />
                          <span>{source.url}</span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
            <Link
              href="/tips"
              className="mt-9 inline-flex min-h-12 items-center gap-3 font-bold text-forest underline underline-offset-4"
            >
              <span aria-hidden="true">←</span> Back to all tips
            </Link>
          </article>
        </Container>
      </Section>
    </>
  );
}

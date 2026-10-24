import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui";
import { EmailSignup } from "@/components/email-signup";
import { JsonLd } from "@/components/json-ld";
import { products, getProduct } from "@/content/products";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return pageMetadata(product.title, product.shortDescription, `/shop/${slug}`);
}

function checkoutUrl(value: string) {
  try {
    const url = new URL(value);
    const allowed = ["gumroad.com", "etsy.com"].some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
    return url.protocol === "https:" && allowed && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const buyUrl = checkoutUrl(product.buyUrl);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.shortDescription,
          image: absoluteUrl(product.coverImage),
          url: absoluteUrl(`/shop/${product.slug}`),
          category: product.format,
          brand: { "@type": "Brand", name: "Caregiving Desk" },
        }}
      />
      <Section>
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/shop"
                  className="inline-flex min-h-12 items-center underline underline-offset-4"
                >
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{product.shortTitle ?? product.title}</li>
            </ol>
          </nav>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <figure className="overflow-hidden rounded-2xl border border-border bg-sage">
              <Image
                src={product.coverImage}
                alt={product.coverAlt}
                width={760}
                height={570}
                className="aspect-[4/3] w-full object-cover"
                sizes="(max-width: 1023px) 100vw, 50vw"
                priority
              />
              {product.status === "coming-soon" && (
                <figcaption className="border-t border-border bg-paper px-6 py-4 text-muted">
                  Concept cover — a placeholder for the finished printable.
                </figcaption>
              )}
            </figure>
            <div>
              <span className="inline-flex rounded-full bg-sage px-4 py-2 font-bold text-forest">
                {product.status === "coming-soon" ? "Coming soon" : "Available now"}
              </span>
              <h1 className="mt-5 font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
                {product.title}
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-muted">
                {product.shortDescription}
              </p>
              <dl className="mt-7 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
                <div>
                  <dt className="font-bold text-forest">Format</dt>
                  <dd className="mt-1 text-ink">{product.format}</dd>
                </div>
                <div>
                  <dt className="font-bold text-forest">Pages</dt>
                  <dd className="mt-1 text-ink">{product.pageCount}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-bold text-forest">Price</dt>
                  <dd className="mt-1 text-ink">{product.price}</dd>
                </div>
              </dl>
              {product.legalNote && (
                <p className="mt-6 rounded-xl border border-border bg-sage p-5 text-ink">
                  {product.legalNote}
                </p>
              )}
              <div className="mt-7">
                {product.status === "coming-soon" ? (
                  <EmailSignup
                    source={`product:${product.slug}`}
                    title="Be the first to hear."
                    description="Get an email when this printable is ready."
                    buttonLabel="Notify me"
                  />
                ) : buyUrl ? (
                  <>
                    <a
                      href={buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-forest px-7 py-3 font-bold text-paper hover:bg-ink"
                    >
                      Buy now <span aria-hidden="true">→</span>
                      <span className="sr-only">
                        (opens external checkout in a new tab)
                      </span>
                    </a>
                    <p className="mt-3 text-muted">
                      Opens an outside checkout in a new tab. No payment details are
                      collected here.
                    </p>
                  </>
                ) : (
                  <p className="rounded-xl border border-border bg-sage p-5 text-ink">
                    The checkout link is being prepared. Please check back soon.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="border-y border-border bg-paper">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-serif text-3xl text-ink">What’s inside</h2>
              <ul className="mt-6 space-y-4">
                {product.inside.map((item) => (
                  <li key={item} className="flex gap-4 text-muted">
                    <span aria-hidden="true" className="font-bold text-forest">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-ink">Made with you in mind</h2>
              <p className="mt-6 text-muted">{product.audience}</p>
              <p className="mt-5 text-muted">
                Education and organization only. These printables do not replace
                personalized medical, legal, or professional advice.
              </p>
            </div>
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl text-ink">A few useful answers</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {product.faqs.map((faq) => (
                <details key={faq.question} className="group py-2">
                  <summary className="min-h-12 cursor-pointer py-4 pr-3 font-bold text-ink">
                    {faq.question}
                  </summary>
                  <p className="pb-5 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
            <Link
              href="/shop"
              className="mt-7 inline-flex min-h-12 items-center gap-3 font-bold text-forest underline underline-offset-4"
            >
              <span aria-hidden="true">←</span> Back to all printables
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Button, Container, Section } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { TipCard } from "@/components/tip-card";
import { EmailSignup } from "@/components/email-signup";
import { products } from "@/content/products";
import { tips } from "@/content/tips";
import { site } from "@/content/site";
import { fridgeSheet } from "@/content/resources";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Simple tips for aging well",
  "A warm place for older adults and family caregivers. Explore educational tips, thoughtful printables, and the free Parent’s Fridge Sheet. Dr. Bennett is an AI presenter.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <Section className="overflow-hidden pt-10 sm:pt-16 lg:pb-14">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <div className="relative z-10">
              <p className="eyebrow mb-6 flex items-center gap-3 text-forest">
                <span className="h-px w-7 bg-forest" />
                For the everyday moments of care
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,4.5vw,3.85rem)] leading-[1.14] tracking-[-0.045em]">
                Simple, trusted health tips for aging well,{" "}
                <span className="text-forest">and for the families who care.</span>
              </h1>
              <p className="mt-7 max-w-xl text-xl leading-relaxed text-muted">
                Growing older. Caring for a parent. Taking it one day at a time. Find a
                little guidance for the moments that matter.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <Button href="/free-fridge-sheet">
                  Get the free Parent&apos;s Fridge Sheet{" "}
                  <span aria-hidden="true">→</span>
                </Button>
                <Button href="/shop" variant="text" className="px-0 hover:bg-transparent">
                  Browse the shop <span aria-hidden="true">→</span>
                </Button>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[18px] text-muted">
                <span aria-hidden="true" className="text-forest">
                  ✧
                </span>
                Simple language. Thoughtful tools. Education only.
              </p>
            </div>
            <figure className="relative mx-auto w-full max-w-xl lg:pl-2">
              <div className="overflow-hidden rounded-[1.75rem] bg-sage">
                <Image
                  src={site.images.hero.src}
                  alt={site.images.hero.alt}
                  width={site.images.hero.width}
                  height={site.images.hero.height}
                  preload
                  sizes="(max-width: 1023px) 90vw, 42vw"
                  className="aspect-square w-full object-cover object-[50%_40%]"
                />
              </div>
              <div className="relative mx-5 -mt-10 rounded-xl border border-border bg-paper px-6 py-5 shadow-[0_8px_30px_-15px_#273b3225] sm:mx-8">
                <p className="font-serif text-xl leading-snug">
                  You don&apos;t have to figure it all out today.
                </p>
                <p className="mt-1 text-[18px] text-muted">
                  A little care is a good place to start.
                </p>
              </div>
              <figcaption className="mt-4 text-center text-[18px] text-muted">
                <span className="mb-1 block font-bold text-forest">
                  Dr. Bennett, George &amp; Margaret
                </span>
                {site.characterImageDisclosure}
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      <div className="border-y border-border bg-sage/60">
        <Container className="grid gap-5 py-6 sm:grid-cols-3">
          {[
            ["01", "Made for real life", "Small steps, at your own pace."],
            ["02", "For you & your family", "A place for both sides of care."],
            ["03", "Clear about our role", "Education, never medical advice."],
          ].map(([number, title, text]) => (
            <div key={title} className="flex items-start gap-4 sm:justify-center">
              <span aria-hidden="true" className="pt-1 font-serif text-xl text-forest">
                {number}
              </span>
              <div>
                <p className="font-bold">{title}</p>
                <p className="text-[18px] text-muted">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3 text-forest">A little everyday guidance</p>
              <h2 className="section-title">This week&apos;s tips</h2>
            </div>
            <Button href="/tips" variant="text" className="px-0">
              Explore all tips <span aria-hidden="true">→</span>
            </Button>
          </div>
          <p className="mb-8 max-w-3xl text-muted">
            A preview of what&apos;s to come. These example articles are placeholders
            awaiting sourced content before launch.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[...tips]
              .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
              .slice(0, 3)
              .map((tip) => (
                <TipCard key={tip.slug} tip={tip} />
              ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-[#eeeee5]">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <figure className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-paper">
              <Image
                src={site.images.presenter.src}
                alt={site.images.presenter.alt}
                width={site.images.presenter.width}
                height={site.images.presenter.height}
                sizes="(max-width: 767px) 85vw, 35vw"
                className="h-auto w-full"
              />
            </figure>
            <div>
              <p className="eyebrow mb-4 text-forest">
                A familiar face. An honest introduction.
              </p>
              <h2 className="section-title">Meet Dr. Bennett</h2>
              <p className="mt-6 text-xl">
                A friendly guide to the little things that help families feel more
                prepared.
              </p>
              <p className="mt-4 text-muted">
                Dr. Bennett is an AI virtual presenter—not a real or licensed doctor.
                Alongside our fictional couple, George and Margaret, he helps us share
                simple educational content.
              </p>
              <p className="mt-4 text-muted">
                Our editorial standard is to check health information against trusted
                sources such as the CDC, NIH, NIA, Mayo Clinic, and NHS before
                publication.
              </p>
              <Button href="/about" variant="secondary" className="mt-7">
                Our story &amp; approach <span aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3 text-forest">
                Less to remember. More room to care.
              </p>
              <h2 className="section-title">Thoughtful tools for your family</h2>
            </div>
            <Button href="/shop" variant="text" className="px-0">
              Visit the shop <span aria-hidden="true">→</span>
            </Button>
          </div>
          <p className="mb-8 max-w-2xl text-muted">
            Simple printable plans, lists, and guides for everyday caregiving. In the
            works, with care.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <Container>
          <div className="grid items-center gap-9 rounded-2xl bg-sage p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:p-12">
            <div>
              <p className="eyebrow mb-4 text-forest">
                One small thing, a little more organized
              </p>
              <h2 className="section-title">
                The important details.
                <br />
                In one easy-to-find place.
              </h2>
              <p className="mt-5 max-w-xl text-muted">
                The free, two-page Parent&apos;s Fridge Sheet brings key health
                information, medicines, and emergency contacts together.
              </p>
              <Button href="/free-fridge-sheet" className="mt-7">
                Meet your free fridge sheet <span aria-hidden="true">→</span>
              </Button>
            </div>
            <div className="relative mx-auto max-w-xs">
              <Image
                src={fridgeSheet.preview}
                alt="Preview of page 1 of the free Parent’s Care Information printable, with blank spaces for care details, allergies, and contacts."
                width={fridgeSheet.previewWidth}
                height={fridgeSheet.previewHeight}
                className="h-auto max-h-80 w-auto"
                sizes="320px"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-paper">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 text-forest">
              A little encouragement for your scroll
            </p>
            <h2 className="section-title">Follow along</h2>
            <p className="mt-5 text-muted">
              Short videos, simple ideas, and everyday moments with Dr. Bennett, George,
              and Margaret.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {site.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-4 rounded-lg border border-border px-5 py-3 hover:bg-sage"
                >
                  {social.name}
                  <span aria-hidden="true">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
            <Link
              href="/about"
              className="text-link mt-5 inline-flex min-h-12 items-center"
            >
              Learn about our AI presenters
            </Link>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <EmailSignup
              source="home-band"
              title="A little care, delivered."
              description="New tips, useful printables, and a gentle reminder that you're not doing this alone."
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

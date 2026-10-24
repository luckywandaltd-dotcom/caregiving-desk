import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About Caregiving Desk",
  "Meet the idea behind Caregiving Desk, our fictional characters, and our education-only publishing standards. Dr. Bennett is an AI virtual presenter, not a doctor.",
  "/about",
);

const editorialSteps = [
  {
    title: "Start with a trusted source",
    description:
      "Use relevant guidance from the CDC, NIH, NIA, Mayo Clinic, or NHS. Find the original page and check that it supports the exact point being made.",
  },
  {
    title: "Keep the meaning clear",
    description:
      "Write in plain language, keep important limits and safety guidance, and link directly to the source. Do not turn general information into personal medical advice.",
  },
  {
    title: "Review before publishing",
    description:
      "Check every health statement, source link, and safety note. Replace all example copy and seek qualified review where needed. Recheck information when guidance changes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Container className="py-12 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="mb-5 font-semibold tracking-wide text-forest">
              A little clarity. A little company.
            </p>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Caring for someone starts with feeling a little more supported.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-muted">
              Caregiving Desk is a place for adults over 60 and the families who care for
              them. Our aim is simple: make everyday information easier to understand, and
              everyday planning easier to begin.
            </p>
            <p className="mt-5 leading-relaxed text-muted">
              We are a brand owned by {site.owner}. We are building short educational tips
              and practical printable tools, with room for the very human side of
              caregiving.
            </p>
          </div>
          <figure className="overflow-hidden rounded-[2rem] border border-border bg-paper">
            <Image
              src={site.images.about.src}
              alt={site.images.about.alt}
              width={site.images.about.width}
              height={site.images.about.height}
              className="aspect-[4/5] w-full object-cover object-[50%_40%]"
              sizes="(max-width: 1023px) 90vw, 40vw"
              preload
            />
            <figcaption className="px-5 py-4 text-center leading-relaxed text-muted">
              {site.characterImageDisclosure}
            </figcaption>
          </figure>
        </div>
      </Container>

      <div className="border-y border-border bg-sage">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 font-semibold text-forest">A clear introduction</p>
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              Meet the characters, know the difference.
            </h2>
            <p className="mt-6 text-xl leading-relaxed">
              Dr. Bennett is an AI virtual presenter. He is not a real person, a licensed
              doctor, or your healthcare professional. His name is a fictional character
              name, not a medical credential.
            </p>
            <p className="mt-5 leading-relaxed text-muted">
              George and Margaret are AI-generated fictional characters who appear
              alongside him in stories and videos. These scenes do not show real
              consultations or patients. Their stories are examples, not testimonials.
            </p>
            <p className="mt-6 rounded-2xl border border-border bg-paper p-6 leading-relaxed">
              {site.disclaimer}
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 sm:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 font-semibold tracking-wide text-forest">
            Our publishing standard
          </p>
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
            Useful information deserves careful checking.
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            These are the steps required before a health tip goes live. The example tips
            currently on this site are layout samples. They have not been published as
            reviewed health guidance and must be replaced before launch.
          </p>
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {editorialSteps.map((step, index) => (
            <section
              className="rounded-2xl border border-border bg-paper p-7"
              key={step.title}
            >
              <span
                className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage font-serif text-xl text-forest"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <h3 className="font-serif text-2xl leading-snug">{step.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{step.description}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-sage p-7 sm:p-9">
          <h3 className="font-serif text-2xl">Where to look for trusted guidance</h3>
          <p className="mt-3 leading-relaxed text-muted">
            These links lead to the organizations themselves. They are not endorsements of
            Caregiving Desk or citations for our example tips.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            {site.trustedSources.map((source) => (
              <li key={source.name}>
                <a
                  className="inline-flex min-h-12 items-center font-semibold text-forest underline underline-offset-4"
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <section className="mt-16" aria-labelledby="about-faq-title">
          <p className="mb-4 font-semibold tracking-wide text-forest">
            A little more clarity
          </p>
          <h2 id="about-faq-title" className="font-serif text-3xl sm:text-4xl">
            Questions you might have
          </h2>
          <div className="mt-8 max-w-4xl divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-2">
                <summary className="min-h-12 cursor-pointer py-4 pr-5 font-semibold text-ink marker:text-forest">
                  {faq.question}
                </summary>
                <p className="max-w-3xl pb-5 leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Button href="/free-fridge-sheet">Explore the free Fridge Sheet</Button>
          <Button href="/contact" variant="secondary">
            Get in touch
          </Button>
        </div>
      </Container>
    </>
  );
}

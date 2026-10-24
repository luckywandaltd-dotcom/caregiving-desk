import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/ui";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact",
  "Get in touch with Caregiving Desk about our educational resources and printable planners for families caring for aging parents.",
  "/contact",
);

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-20">
      <div className="mb-12 max-w-3xl">
        <p className="mb-4 font-semibold uppercase tracking-[0.14em] text-forest">
          A conversation starts here
        </p>
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          We&apos;d love to hear from you.
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-muted">
          A question about a printable? An idea for a future resource? Send a little note
          our way.
        </p>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <ContactForm />
        <aside className="space-y-8">
          <div className="rounded-2xl bg-sage p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-ink">A note before you write</h2>
            <p className="mt-4 text-muted">
              Caregiving Desk shares education and organizational tools. This inbox is not
              a medical service and is not monitored for emergencies.
            </p>
            <p className="mt-4 text-muted">
              For health questions, talk to your doctor or pharmacist. For an emergency,
              contact your local emergency service.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-ink">Find us in your feed</h2>
            <ul className="mt-4 divide-y divide-border">
              {site.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-16 items-center justify-between gap-3 py-3 text-forest"
                  >
                    <span>{social.name}</span>
                    <span className="break-all">
                      {social.handle} <span aria-hidden="true">→</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}

import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui";
import { BrandMark } from "@/components/header";
import { EmailSignup } from "@/components/email-signup";
import { Disclaimer } from "@/components/disclaimer";
import { AnalyticsPreferencesButton } from "@/components/analytics";

const legal = [
  ["Medical disclaimer", "/medical-disclaimer"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Refund policy", "/refund-policy"],
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-sage">
      <Container className="py-14">
        <div className="grid gap-12 border-b border-border pb-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex min-h-12 items-center gap-2 text-forest"
            >
              <BrandMark className="h-11 w-10" />
              <span className="font-serif text-3xl tracking-tight">Caregiving Desk</span>
            </Link>
            <p className="max-w-sm text-muted">
              Small, thoughtful steps for aging well.
              <br />A little support for the people who care.
            </p>
            <nav
              aria-label="Social media"
              className="mt-5 flex flex-wrap gap-x-5 gap-y-1"
            >
              {site.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-1.5 text-[18px] underline decoration-border underline-offset-4 hover:decoration-forest"
                >
                  {social.name}
                  <span aria-hidden="true">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </nav>
          </div>
          <EmailSignup
            source="footer"
            title="A little support in your inbox."
            description="Hear about new tips, printables, and thoughtful ways to care."
            compact
          />
        </div>
        <div className="grid gap-7 pt-9 lg:grid-cols-[1.5fr_1fr]">
          <Disclaimer className="max-w-2xl text-[18px] text-muted" />
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap content-start gap-x-5 gap-y-1 lg:justify-end"
          >
            {[...legal, ["About", "/about"], ["Contact", "/contact"]].map(
              ([label, href]) => (
                <Link
                  className="inline-flex min-h-12 items-center text-[18px] underline decoration-border underline-offset-4 hover:decoration-forest"
                  key={href}
                  href={href}
                >
                  {label}
                </Link>
              ),
            )}
            <AnalyticsPreferencesButton />
          </nav>
        </div>
        <p className="mt-8 text-[18px] text-muted">
          © {new Date().getUTCFullYear()} {site.name}.
        </p>
      </Container>
    </footer>
  );
}

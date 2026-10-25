import Link from "next/link";
import { site } from "@/content/site";
import { fridgeSheet } from "@/content/resources";
import { integrations } from "@/lib/integrations";
import { pageMetadata } from "@/lib/seo";

const printable =
  "https://caregiving-desk.vercel.app/downloads/parents-care-information-printable.pdf";

export const metadata = pageMetadata(
  "Care desk resources",
  "Open the Caregiving Desk website, the free two-page Parent’s Care Information printable, and general public-health homepages.",
  "/care/resources",
);

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl leading-tight">Resources</h1>
        <p className="mt-3 max-w-3xl text-muted">
          These links are educational. They do not replace a conversation with your doctor
          or pharmacist, and the care desk does not turn them into personal advice.
        </p>
      </div>
      <section
        className="space-y-4 rounded-2xl border border-border bg-paper p-5 sm:p-6"
        aria-labelledby="site-links"
      >
        <h2 id="site-links" className="font-serif text-3xl">
          Caregiving Desk
        </h2>
        <p>The website and the free paper sheet live alongside this on-device desk.</p>
        <ul className="space-y-2">
          <li>
            <a
              className="text-link inline-flex min-h-12 items-center font-bold"
              href="https://caregiving-desk.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Caregiving Desk website
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <Link
              className="text-link inline-flex min-h-12 items-center font-bold"
              href="/"
            >
              Home on this site
            </Link>
          </li>
          <li>
            <Link
              className="text-link inline-flex min-h-12 items-center font-bold"
              href="/free-fridge-sheet"
            >
              Free fridge sheet page
            </Link>
          </li>
          <li>
            <Link
              className="text-link inline-flex min-h-12 items-center font-bold"
              href="/tips"
            >
              Example tips
            </Link>
          </li>
          <li>
            <Link
              className="text-link inline-flex min-h-12 items-center font-bold"
              href="/about"
            >
              About and AI presenter disclosure
            </Link>
          </li>
          <li>
            <Link
              className="text-link inline-flex min-h-12 items-center font-bold"
              href="/medical-disclaimer"
            >
              Medical disclaimer
            </Link>
          </li>
        </ul>
      </section>
      <section
        className="space-y-4 rounded-2xl border border-border bg-paper p-5 sm:p-6"
        aria-labelledby="printable-heading"
      >
        <h2 id="printable-heading" className="font-serif text-3xl">
          Free two-page printable
        </h2>
        <p>
          Parent’s Care Information is a blank PDF you print and fill in by hand. No
          signup is required. Writing on the paper does not send those details to this
          website, and it does not fill the care desk for you.
        </p>
        <p>
          <a
            className="text-link inline-flex min-h-12 items-center font-bold"
            href={printable}
            download={fridgeSheet.filename}
          >
            Download the free two-page printable
          </a>
        </p>
        <p>
          <a
            className="text-link inline-flex min-h-12 items-center font-bold"
            href={integrations.fridgeSheet}
          >
            Download the same printable from this site
          </a>
        </p>
      </section>
      <section className="space-y-4" aria-labelledby="sources-heading">
        <h2 id="sources-heading" className="font-serif text-3xl">
          General public-health homepages
        </h2>
        <p>
          These are organization homepages already listed on the website. They are not
          citations for a personal care plan.
        </p>
        <ul className="space-y-2">
          {site.trustedSources.map((source) => (
            <li key={source.url}>
              <a
                className="text-link inline-flex min-h-12 items-center font-bold"
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
      </section>
    </div>
  );
}

import Image from "next/image";
import { EmailSignup } from "@/components/email-signup";
import { Container } from "@/components/ui";
import { fridgeSheet } from "@/content/resources";
import { pageMetadata } from "@/lib/seo";
import { integrations } from "@/lib/integrations";

export const metadata = pageMetadata(
  "Free Parent's Fridge Sheet",
  "Keep a parent's key health information, medicines, and emergency contacts together with a free two-page printable from Caregiving Desk.",
  "/free-fridge-sheet",
);

const benefits = [
  [
    "Key details, together",
    "A place for a parent's key health information and the details they choose to share.",
  ],
  [
    "A clear medicine list",
    "Space for three medicines, vitamins and supplements, and the instructions on their labels.",
  ],
  [
    "People to call",
    "Room for emergency contacts and the people involved in your parent's care.",
  ],
];

export default function FreeFridgeSheetPage() {
  return (
    <>
      <Container className="py-12 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.14em] text-forest">
              A free little helping hand
            </p>
            <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
              The Parent&apos;s
              <br />
              Fridge Sheet.
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted">
              Two simple pages. One familiar place for the details your family wants close
              at hand.
            </p>
            <p className="mt-4 text-muted">
              A printable home for key health information, a medicine list, and emergency
              contacts. Fill it in together, and keep it somewhere that works for your
              family.
            </p>
            <a
              href="#get-the-sheet"
              className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-forest px-7 py-3 font-semibold text-white"
            >
              Get the free sheet{" "}
              <span className="ml-3" aria-hidden="true">
                ↓
              </span>
            </a>
            <p className="mt-4 text-muted">Free PDF · 2 A4 pages · No email required</p>
          </div>
          <figure className="rounded-[2rem] bg-sage p-6 sm:p-10">
            <Image
              src={fridgeSheet.preview}
              width={fridgeSheet.previewWidth}
              height={fridgeSheet.previewHeight}
              alt="First page of Parent’s Care Information, with blank spaces for personal details, allergies, family contacts, doctor, pharmacy, and important document locations."
              className="h-auto w-full rounded-lg shadow-sm"
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 70vw, 85vw"
              preload
            />
            <figcaption className="mt-5 text-center text-muted">
              Page 1 of the actual printable. Page 2 is a medicine and supplement record.
            </figcaption>
          </figure>
        </div>
      </Container>
      <section
        className="border-y border-border bg-paper py-12 sm:py-16"
        aria-labelledby="sheet-benefits"
      >
        <Container>
          <h2 id="sheet-benefits" className="font-serif text-3xl text-ink">
            A little more organized. A little less to remember.
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {benefits.map(([title, description], index) => (
              <div key={title}>
                <span
                  className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-sage font-semibold text-forest"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <h3 className="font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-muted">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <Container className="py-12 sm:py-20">
        <div className="mx-auto max-w-2xl scroll-mt-28" id="get-the-sheet">
          <div className="mb-10 rounded-2xl border border-border bg-paper p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-ink">
              Your free printable is ready.
            </h2>
            <p className="mt-4 text-muted">
              Download {fridgeSheet.title}, our two-page Parent&apos;s Fridge Sheet. Print
              it on A4 paper and fill it in by hand. For another paper size, choose “Fit
              to page” in your printer settings.
            </p>
            <a
              href={integrations.fridgeSheet}
              download={
                integrations.fridgeSheet === fridgeSheet.href
                  ? fridgeSheet.filename
                  : undefined
              }
              className="mt-6 inline-flex min-h-14 items-center justify-center rounded-full bg-forest px-7 py-3 font-semibold text-white"
            >
              Download the free PDF
            </a>
            <p className="mt-4 text-muted">2 pages · PDF · No signup required</p>
            <p className="mt-4 text-muted">
              Page 1 has space for your parent&apos;s details, allergies and reactions,
              first and backup contacts, doctor and pharmacy, and where important papers
              are kept. Page 2 records current medicines, vitamins, and supplements. Print
              another copy if you need more entries.
            </p>
          </div>
          <EmailSignup
            source="fridge-sheet"
            title="Keep in touch, if you’d like."
            description="Email updates are optional. Sign up for tips and news from Caregiving Desk when our email service is available. Your free download does not require a subscription."
            buttonLabel="Sign up for emails"
          />
          <p className="mt-6 text-muted">
            Choose a storage spot that protects your family&apos;s privacy. Share only the
            details your parent is comfortable sharing, and review the information
            together when it changes.
          </p>
          <p className="mt-4 text-muted">
            The sheet is an organizational aid. It does not replace medical records, a
            care plan, or advice from a doctor or pharmacist.
          </p>
        </div>
      </Container>
    </>
  );
}

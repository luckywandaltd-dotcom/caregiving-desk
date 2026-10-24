import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui";

type LegalSection = {
  title: string;
  content: ReactNode;
};

export function LegalPage({
  title,
  introduction,
  sections,
}: {
  title: string;
  introduction: string;
  sections: LegalSection[];
}) {
  return (
    <Container className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-semibold tracking-wide text-forest">
          A few important details
        </p>
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
        <div className="my-8 rounded-2xl border border-border bg-sage p-6" role="note">
          <p className="font-semibold">
            Starter text – review with a professional before launch.
          </p>
          <p className="mt-2 text-muted">
            This page is a draft for Caregiving Desk, a brand owned by Voice Of Peshawar
            LLC.
          </p>
        </div>
        <p className="text-xl leading-relaxed text-muted">{introduction}</p>
        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 font-serif text-2xl sm:text-3xl">{section.title}</h2>
              <div className="space-y-4 leading-relaxed text-muted">
                {section.content}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-6">
          <Link
            className="inline-flex min-h-12 items-center font-semibold text-forest underline underline-offset-4"
            href="/contact"
          >
            Contact Caregiving Desk
          </Link>
        </div>
      </div>
    </Container>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Tip } from "@/content/tips";

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-paper">
      <Image
        src={tip.image}
        alt={tip.imageAlt}
        width={640}
        height={440}
        className="aspect-[16/11] w-full object-cover"
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="font-bold text-forest">{tip.category}</p>
        <h3 className="font-serif text-2xl leading-snug text-ink">
          <Link
            href={`/tips/${tip.slug}`}
            className="inline-flex min-h-12 items-center underline-offset-4 hover:underline"
          >
            {tip.title}
          </Link>
        </h3>
        <p className="text-muted">{tip.summary}</p>
        {tip.example && (
          <p className="rounded-lg bg-sage px-3 py-2 text-forest">
            EXAMPLE CONTENT – replace before launch
          </p>
        )}
        <Link
          href={`/tips/${tip.slug}`}
          className="mt-auto inline-flex min-h-12 items-center gap-3 self-start font-bold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
        >
          Read the {tip.example ? "example" : "tip"} <span aria-hidden="true">→</span>
          <span className="sr-only">: {tip.title}</span>
        </Link>
      </div>
    </article>
  );
}

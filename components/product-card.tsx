import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-paper">
      <Link
        href={`/shop/${product.slug}`}
        className="block overflow-hidden bg-sage"
        aria-label={`Explore ${product.title}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.coverImage}
          alt={product.coverAlt}
          width={640}
          height={480}
          className="aspect-[4/3] w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.025]"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-forest">
          <span className="rounded-full bg-sage px-3 py-1">
            {product.status === "coming-soon" ? "Coming soon" : "Available"}
          </span>
          <span>{product.format}</span>
        </div>
        <h3 className="font-serif text-2xl leading-snug text-ink">
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex min-h-12 items-center underline-offset-4 hover:underline"
          >
            {product.shortTitle ?? product.title}
          </Link>
        </h3>
        <p className="text-muted">{product.shortDescription}</p>
        <p className="mt-auto border-t border-border pt-4 text-muted">
          {product.pageCount}
        </p>
        <Link
          href={`/shop/${product.slug}`}
          className="inline-flex min-h-12 items-center gap-3 self-start font-bold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
        >
          Explore the printable <span aria-hidden="true">→</span>
          <span className="sr-only">: {product.title}</span>
        </Link>
      </div>
    </article>
  );
}

import { Container, Section } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { products } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "The printable shop",
  "Explore coming-soon Caregiving Desk printables for organizing family care, important information, and everyday caregiving tasks.",
  "/shop",
);

export default function ShopPage() {
  const comingSoonCount = products.filter(
    (product) => product.status === "coming-soon",
  ).length;
  return (
    <>
      <Section className="border-b border-border bg-sage/50">
        <Container>
          <p className="mb-5 font-bold uppercase tracking-[0.14em] text-forest">
            The printable shop
          </p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            A little order.
            <br />A little more peace of mind.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
            Thoughtful printable tools for the everyday work of caring. Keep the details
            together, so you can focus on the people who matter.
          </p>
          {comingSoonCount > 0 && (
            <p className="mt-6 max-w-2xl rounded-xl border border-border bg-paper p-4 text-ink">
              {comingSoonCount === products.length
                ? "Our first collection is in the making. All products are coming soon;"
                : "More printables are in the making. For coming-soon products,"}{" "}
              prices, page counts, and covers are clearly marked previews.
            </p>
          )}
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-serif text-3xl text-ink">Made for real family life</h2>
            <p className="text-muted">
              {products.length} printables
              {comingSoonCount === products.length ? " in preparation" : " to explore"}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-muted">
            Digital products only. When available, purchases will be completed through the
            linked outside shop. We never collect payment card details on this website.
          </p>
        </Container>
      </Section>
    </>
  );
}

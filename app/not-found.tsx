import { Button, Container, Section } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Page not found",
  "This page is not here, but a little guidance is nearby. Find your way back to Caregiving Desk’s tips, shop, or home page.",
  "/404",
);

export default function NotFound() {
  return (
    <Section>
      <Container className="py-12 text-center">
        <p className="eyebrow mb-5 text-forest">404 · A little detour</p>
        <h1 className="page-title">Let&apos;s find your way back.</h1>
        <p className="mx-auto mt-6 max-w-lg text-xl text-muted">
          This page may have moved, or the address might have a small typo. There&apos;s
          still a warm welcome waiting for you.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Button href="/tips" variant="secondary">
            Browse Tips
          </Button>
          <Button href="/shop" variant="secondary">
            Visit the Shop
          </Button>
        </div>
      </Container>
    </Section>
  );
}

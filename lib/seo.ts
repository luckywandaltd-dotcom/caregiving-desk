import type { Metadata } from "next";

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return "https://example.com";
  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.protocol !== "http:")
      return "https://example.com";
    return url.origin;
  } catch {
    return "https://example.com";
  }
}
export const siteUrl = resolveSiteUrl();
export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString().replace(/\/$/, "");
}
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${title} | Caregiving Desk`,
      description,
      url: absoluteUrl(path),
      type: "website",
      siteName: "Caregiving Desk",
      images: [
        {
          url: absoluteUrl("/images/og-default.png"),
          width: 1200,
          height: 630,
          alt: "Caregiving Desk — a little guidance, a little more peace of mind.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Caregiving Desk`,
      description,
      images: [absoluteUrl("/images/og-default.png")],
    },
  };
}

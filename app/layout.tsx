import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/content/site";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import "./globals.css";

const lora = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/lora/files/lora-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/lora/files/lora-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-lora",
  display: "swap",
});
const atkinson = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caregiving Desk | A little care goes a long way",
    template: "%s | Caregiving Desk",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Caregiving Desk illustrated brand card",
      },
    ],
  },
  twitter: { card: "summary_large_image", site: "@caregiverdesk" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f7f2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lora.variable} ${atkinson.variable}`}>
      <body className="font-sans antialiased">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: absoluteUrl(),
            description: site.description,
            parentOrganization: { "@type": "Organization", name: site.owner },
            sameAs: site.socials.map(({ url }) => url),
            logo: absoluteUrl("/icon.svg"),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}

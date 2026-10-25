import type { Metadata } from "next";
import { CareShell } from "@/components/care/shell";
import { CareProvider } from "@/components/care/store";

export const metadata: Metadata = {
  applicationName: "Caregiving Desk",
  manifest: "/care/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Caregiving Desk",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/care/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/care/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/care/icon-192.png", sizes: "192x192" }],
  },
};

export default function CareLayout({ children }: { children: React.ReactNode }) {
  return (
    <CareProvider>
      <CareShell>{children}</CareShell>
    </CareProvider>
  );
}

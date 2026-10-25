"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/ui";
import { CareLink } from "@/components/care/ui";

const links = [
  { href: "/care", label: "Today", exact: true },
  { href: "/care/profiles", label: "Profiles" },
  { href: "/care/medications", label: "Medicines" },
  { href: "/care/appointments", label: "Appointments" },
  { href: "/care/checklist", label: "Checklist" },
  { href: "/care/notes", label: "Notes" },
  { href: "/care/resources", label: "Resources" },
  { href: "/care/data", label: "Your data" },
];

const cachePaths = [
  "/care",
  "/care/profiles",
  "/care/medications",
  "/care/appointments",
  "/care/checklist",
  "/care/notes",
  "/care/resources",
  "/care/data",
  "/downloads/parents-care-information-printable.pdf",
  "/care/manifest.webmanifest",
  "/care/icon-192.png",
  "/care/icon-512.png",
  "/care/icon-maskable-512.png",
];

function OfflineRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      document.documentElement.dataset.careOfflineReady = "unsupported";
      return;
    }
    let cancelled = false;
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "CACHE_URLS_DONE") {
        document.documentElement.dataset.careOfflineReady = "true";
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (cancelled) return;
        const worker = registration.active;
        if (!worker) return;
        const origin = window.location.origin;
        const resources = performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((url) => {
            try {
              const parsed = new URL(url);
              return (
                parsed.origin === origin &&
                (parsed.pathname.startsWith("/_next/static/") ||
                  parsed.pathname.startsWith("/images/") ||
                  parsed.pathname.startsWith("/care/"))
              );
            } catch {
              return false;
            }
          });
        worker.postMessage({
          type: "CACHE_URLS",
          urls: [...cachePaths.map((path) => origin + path), ...resources],
        });
      })
      .catch(() => {
        document.documentElement.dataset.careOfflineReady = "unsupported";
      });
    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, []);
  return null;
}

function BlockTrackers() {
  useEffect(() => {
    const scoped = window as Window & {
      gtag?: (...args: unknown[]) => void;
      plausible?: (...args: unknown[]) => void;
    };
    scoped.gtag = () => {};
    scoped.plausible = () => {};
    document
      .querySelectorAll(
        'script[src*="googletagmanager.com"], script[src*="google-analytics.com"], script[src*="plausible.io"]',
      )
      .forEach((node) => node.remove());
  }, []);
  return null;
}

export function CareShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="bg-cream">
      <OfflineRegistration />
      <BlockTrackers />
      <Container className="py-6 sm:py-8">
        <nav aria-label="Care desk" className="flex flex-wrap gap-2">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <CareLink
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="inline-flex min-h-12 items-center rounded-lg border border-border bg-paper px-4 font-bold aria-[current=page]:border-forest aria-[current=page]:bg-sage"
              >
                {link.label}
              </CareLink>
            );
          })}
        </nav>
        <p className="mt-4 rounded-2xl border border-border bg-sage px-4 py-3">
          Records stay on this device. They are not automatically shared or backed up.
        </p>
        <CareLink
          href="/care/data"
          className="text-link inline-flex min-h-12 items-center font-bold"
        >
          Export a copy
        </CareLink>
        <div className="mt-8">{children}</div>
      </Container>
    </div>
  );
}

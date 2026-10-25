"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const storageKey = "caregiving-desk-analytics-consent";
const changeEvent = "caregiving-desk:analytics-change";
const openEvent = "caregiving-desk:analytics-preferences";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const usePlausible = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(
  plausibleDomain,
);
const useGoogle = !usePlausible && /^G-[A-Z0-9]+$/.test(measurementId);
const configured = usePlausible || useGoogle;
type Consent = "accepted" | "declined" | "unset";
let memoryConsent: Consent = "unset";

function readConsent(): Consent {
  try {
    const value = localStorage.getItem(storageKey);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    // Private browsing or blocked storage: keep this page's choice in memory.
  }
  return memoryConsent;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

function serverConsent(): Consent {
  return "unset";
}

export function AnalyticsPreferencesButton() {
  const pathname = usePathname() || "";
  const onCareDesk = pathname === "/care" || pathname.startsWith("/care/");
  if (!configured || onCareDesk) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(openEvent))}
      className="inline-flex min-h-12 items-center text-left text-forest underline underline-offset-4"
    >
      Analytics preferences
    </button>
  );
}

export function Analytics() {
  const pathname = usePathname() || "";
  const onCareDesk = pathname === "/care" || pathname.startsWith("/care/");
  const consent = useSyncExternalStore(subscribe, readConsent, serverConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    function openPreferences() {
      setPreferencesOpen(true);
    }
    window.addEventListener(openEvent, openPreferences);
    return () => window.removeEventListener(openEvent, openPreferences);
  }, []);

  function chooseConsent(value: Exclude<Consent, "unset">) {
    memoryConsent = value;
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      /* The choice still applies to this page. */
    }
    window.dispatchEvent(new Event(changeEvent));
    setPreferencesOpen(false);
    if (consent === "accepted" && value === "declined") {
      // Reload to unload a previously consented analytics script completely.
      window.location.reload();
    }
  }

  if (!configured || onCareDesk) return null;

  return (
    <>
      {consent === "accepted" && usePlausible && (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={plausibleDomain}
          strategy="afterInteractive"
        />
      )}
      {consent === "accepted" && useGoogle && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="caregiving-desk-google-analytics"
            strategy="afterInteractive"
          >{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${JSON.stringify(measurementId)}, {anonymize_ip: true});`}</Script>
        </>
      )}
      {(consent === "unset" || preferencesOpen) && (
        <section
          aria-label="Analytics privacy preferences"
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto border-t border-border bg-paper p-5 shadow-lg sm:p-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl text-ink">A small note about privacy</h2>
              <p className="mt-2 text-muted">
                With your permission, optional analytics may use cookies to help us
                understand which pages are helpful. You can change your choice at any
                time.
              </p>
              <Link
                href="/privacy"
                className="inline-flex min-h-12 items-center font-semibold text-forest underline underline-offset-4"
              >
                Read our privacy policy
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => chooseConsent("declined")}
                className="min-h-12 rounded-full border border-forest px-6 py-3 font-semibold text-forest"
              >
                No thanks
              </button>
              <button
                type="button"
                onClick={() => chooseConsent("accepted")}
                className="min-h-12 rounded-full bg-forest px-6 py-3 font-semibold text-white"
              >
                Allow analytics
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

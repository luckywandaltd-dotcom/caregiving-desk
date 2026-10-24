"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { integrations, postJsonForm } from "@/lib/integrations";
import { useHydrated } from "@/lib/use-hydrated";

type EmailSignupProps = {
  source?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  compact?: boolean;
};

export function EmailSignup({
  source = "website",
  title = "A little support in your inbox.",
  description = "Simple tips, thoughtful resources, and news from Caregiving Desk.",
  buttonLabel = "Keep me in the loop",
  compact = false,
}: EmailSignupProps) {
  const id = useId();
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const configured = Boolean(integrations.emailAction);
  const hydrated = useHydrated();
  const ready = integrations.emailMode === "native" || hydrated;
  const sheetUrl = integrations.fridgeSheet;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!integrations.emailAction || data.get("_gotcha")) {
      event.preventDefault();
      setState("error");
      setMessage("We could not send this request. Please try again later.");
      return;
    }
    if (integrations.emailMode === "native") {
      // Standard provider forms own the confirmation page and avoid CORS requirements.
      setState("submitting");
      return;
    }
    event.preventDefault();
    setState("submitting");
    setMessage("");
    try {
      await postJsonForm(integrations.emailAction, {
        [integrations.emailField]: String(data.get(integrations.emailField) || ""),
        source,
        consent: "yes",
        _gotcha: "",
      });
      setState("success");
      setMessage(
        "Thank you. Your request was received. Check your inbox for any confirmation steps.",
      );
      form.reset();
    } catch {
      setState("error");
      setMessage(
        "We could not send your request. Your email has not been confirmed. Please try again.",
      );
    }
  }

  return (
    <div
      className={
        compact ? "w-full" : "rounded-2xl border border-border bg-paper p-6 sm:p-8"
      }
    >
      <h2
        className="font-serif text-2xl leading-snug text-ink sm:text-3xl"
        id={`${id}-title`}
      >
        {title}
      </h2>
      <p className="mt-3 text-muted">{description}</p>
      {!configured && integrations.hostedSignup ? (
        <div className="mt-5">
          <a
            href={integrations.hostedSignup}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 py-3 font-semibold text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            {buttonLabel} <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="mt-3 text-muted">Continue to our email provider to sign up.</p>
        </div>
      ) : (
        <form
          action={integrations.emailAction}
          method="post"
          onSubmit={handleSubmit}
          aria-labelledby={`${id}-title`}
          aria-describedby={!configured ? `${id}-availability` : undefined}
          aria-busy={(configured && !ready) || state === "submitting"}
          className="mt-5 space-y-4"
        >
          {!configured && (
            <p id={`${id}-availability`} className="rounded-xl bg-sage p-4 text-ink">
              Email sign-up is coming soon. Please check back; this form is not collecting
              email addresses yet.
            </p>
          )}
          {configured && !ready && (
            <p className="text-muted" role="status">
              The sign-up form is getting ready. Please wait a moment.
            </p>
          )}
          {configured && integrations.emailMode === "json" && (
            <noscript>
              <p className="rounded-xl bg-sage p-4 text-ink">
                Please enable JavaScript to use this sign-up form, or find us through the
                social links below.
              </p>
            </noscript>
          )}
          <input type="hidden" name="source" value={source} />
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`${id}-website`}>Leave this field empty</label>
            <input id={`${id}-website`} name="_gotcha" tabIndex={-1} autoComplete="off" />
          </div>
          <div>
            <label className="mb-2 block font-semibold text-ink" htmlFor={`${id}-email`}>
              Your email address
            </label>
            <input
              id={`${id}-email`}
              name={integrations.emailField}
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              disabled={
                !configured ||
                !ready ||
                (state === "submitting" && integrations.emailMode === "json")
              }
              placeholder="you@example.com"
              className="min-h-14 w-full rounded-xl border border-muted bg-paper px-4 py-3 text-ink disabled:cursor-not-allowed disabled:bg-cream"
            />
          </div>
          <label
            htmlFor={`${id}-consent`}
            className="flex min-h-12 cursor-pointer items-start gap-3 text-muted"
          >
            <input
              id={`${id}-consent`}
              name="consent"
              type="checkbox"
              value="yes"
              required
              disabled={
                !configured ||
                !ready ||
                (state === "submitting" && integrations.emailMode === "json")
              }
              className="mt-1 size-6 shrink-0 accent-forest"
            />
            <span>
              I agree to receive emails from Caregiving Desk. I can unsubscribe at any
              time.
            </span>
          </label>
          <p className="text-muted">
            Read our{" "}
            <Link
              href="/privacy"
              className="inline-flex min-h-12 items-center font-semibold text-forest underline underline-offset-4"
            >
              privacy policy
            </Link>
            .
          </p>
          <button
            type="submit"
            disabled={!configured || !ready || state === "submitting"}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-forest px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-muted"
          >
            {state === "submitting" ? "Sending…" : buttonLabel}
          </button>
          <div aria-live="polite" aria-atomic="true">
            {message && (
              <p
                className="rounded-xl border border-border bg-cream p-4 text-ink"
                role={state === "error" ? "alert" : "status"}
              >
                {message}
              </p>
            )}
            {state === "success" && source === "fridge-sheet" && sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-12 items-center font-semibold text-forest underline underline-offset-4"
              >
                Open the Parent&apos;s Fridge Sheet{" "}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { integrations, postJsonForm } from "@/lib/integrations";
import { useHydrated } from "@/lib/use-hydrated";

export function ContactForm() {
  const id = useId();
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const configured = Boolean(integrations.contactEndpoint);
  const hydrated = useHydrated();
  const fieldClass =
    "min-h-14 w-full rounded-xl border border-muted bg-paper px-4 py-3 text-ink disabled:cursor-not-allowed disabled:bg-cream";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!integrations.contactEndpoint || data.get("_gotcha")) {
      setState("error");
      setMessage("We could not send this message. Please try again later.");
      return;
    }
    if (
      String(data.get("name") || "").trim().length < 2 ||
      String(data.get("message") || "").trim().length < 10
    ) {
      setState("error");
      setMessage(
        "Please add your name and a message of at least 10 characters, not just spaces.",
      );
      return;
    }
    setState("submitting");
    setMessage("");
    try {
      await postJsonForm(integrations.contactEndpoint, {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        message: String(data.get("message") || "").trim(),
        _gotcha: "",
      });
      setState("success");
      setMessage("Thank you. Your message was sent successfully.");
      form.reset();
    } catch {
      setState("error");
      setMessage(
        "Your message could not be sent. Your words are still here, so you can try again.",
      );
    }
  }

  return (
    <form
      action={integrations.contactEndpoint}
      method="post"
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-paper p-6 sm:p-8"
      aria-label="Contact Caregiving Desk"
      aria-busy={(configured && !hydrated) || state === "submitting"}
    >
      {!configured && (
        <p className="rounded-xl bg-sage p-4 text-ink" id={`${id}-availability`}>
          Our contact form is coming soon. For now, you can find us on the social channels
          listed here.
        </p>
      )}
      {configured && !hydrated && (
        <p className="text-muted" role="status">
          The contact form is getting ready. Please wait a moment.
        </p>
      )}
      {configured && (
        <noscript>
          <p className="rounded-xl bg-sage p-4 text-ink">
            Please enable JavaScript to send a message, or use the social links on this
            page to find us.
          </p>
        </noscript>
      )}
      <p className="text-muted" id={`${id}-guidance`}>
        For general questions only. Please do not send medical details or personal health
        information. We cannot give individual medical advice.
      </p>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label className="mb-2 block font-semibold text-ink" htmlFor={`${id}-name`}>
          Your name
        </label>
        <input
          className={fieldClass}
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          pattern=".*\S.*"
          disabled={!configured || !hydrated || state === "submitting"}
        />
      </div>
      <div>
        <label className="mb-2 block font-semibold text-ink" htmlFor={`${id}-email`}>
          Your email address
        </label>
        <input
          className={fieldClass}
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          disabled={!configured || !hydrated || state === "submitting"}
        />
      </div>
      <div>
        <label className="mb-2 block font-semibold text-ink" htmlFor={`${id}-message`}>
          Your message
        </label>
        <textarea
          className={`${fieldClass} min-h-44 resize-y`}
          id={`${id}-message`}
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          aria-describedby={`${id}-guidance`}
          disabled={!configured || !hydrated || state === "submitting"}
        />
      </div>
      <p className="text-muted">
        We use your details to respond to your message. Read our{" "}
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
        disabled={!configured || !hydrated || state === "submitting"}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-forest px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-muted"
      >
        {state === "submitting" ? "Sending your message…" : "Send message"}
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
      </div>
    </form>
  );
}

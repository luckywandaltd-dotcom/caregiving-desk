/** Public, build-time integration settings. Never put API secrets in NEXT_PUBLIC variables. */
export function safeHttpsUrl(value: string | undefined): string | undefined {
  if (!value || value.includes("PLACEHOLDER")) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export const integrations = {
  emailAction: safeHttpsUrl(process.env.NEXT_PUBLIC_EMAIL_FORM_ACTION_URL),
  emailField: process.env.NEXT_PUBLIC_EMAIL_FIELD_NAME || "email",
  emailMode: process.env.NEXT_PUBLIC_EMAIL_FORM_MODE === "json" ? "json" : "native",
  hostedSignup: safeHttpsUrl(process.env.NEXT_PUBLIC_EMAIL_SIGNUP_URL),
  fridgeSheet: process.env.NEXT_PUBLIC_FRIDGE_SHEET_URL || "PLACEHOLDER_FRIDGE_SHEET_URL",
  contactEndpoint: safeHttpsUrl(process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT),
} as const;

export async function postJsonForm(
  endpoint: string,
  data: Record<string, string>,
): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
      credentials: "omit",
    });
    if (!response.ok) throw new Error("The provider did not accept the form.");
    // JSON mode deliberately requires a JSON acknowledgement, not an opaque or HTML response.
    const result: unknown = await response.json();
    if (typeof result !== "object" || result === null) {
      throw new Error("The provider did not confirm the submission.");
    }
    const acknowledgement = result as Record<string, unknown>;
    if (
      acknowledgement.error ||
      (Array.isArray(acknowledgement.errors) && acknowledgement.errors.length > 0) ||
      !(acknowledgement.ok === true || acknowledgement.success === true)
    ) {
      throw new Error("The provider reported an error.");
    }
  } finally {
    clearTimeout(timeout);
  }
}

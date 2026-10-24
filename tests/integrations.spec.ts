import { expect, test, type Page, type Route } from "@playwright/test";

const baseUrl = process.env.INTEGRATION_BASE_URL || "http://127.0.0.1:3001";
const emailEndpoint = "https://forms.example.test/email";
const contactEndpoint = "https://forms.example.test/contact";
const consentKey = "caregiving-desk-analytics-consent";
const plausibleScript = "https://plausible.io/js/script.js";

async function mockJsonEndpoint(
  page: Page,
  endpoint: string,
  respond: (route: Route) => Promise<void>,
) {
  await page.route(endpoint, async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type, accept",
        },
      });
      return;
    }
    await respond(route);
  });
}

test.describe("configured integrations with mocked providers", () => {
  test.skip(
    process.env.TEST_INTEGRATIONS !== "1",
    "Run against the separately configured integration server.",
  );

  test.beforeEach(async ({ page }) => {
    // Never submit to a real provider or allow analytics traffic in these tests.
    await page.route("https://**/*", (route) => route.abort("blockedbyclient"));
  });

  test("JSON forms stay disabled without JavaScript and never default to GET", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      await context.route("https://**/*", (route) => route.abort("blockedbyclient"));
      const page = await context.newPage();
      await page.goto(`${baseUrl}/contact`);
      const contact = page.getByRole("form", { name: "Contact Caregiving Desk" });
      await expect(contact).toHaveAttribute("method", "post");
      await expect(contact).toHaveAttribute("action", contactEndpoint);
      await expect(contact.getByRole("button", { name: "Send message" })).toBeDisabled();
      await expect(contact.getByLabel("Your message")).toBeDisabled();
      await expect(
        contact.getByText(/Please enable JavaScript to send a message/),
      ).toBeVisible();
      expect(new URL(page.url()).search).toBe("");

      await page.goto(`${baseUrl}/free-fridge-sheet`);
      const email = page.getByRole("form", {
        name: "Keep in touch, if you’d like.",
      });
      await expect(email).toHaveAttribute("method", "post");
      await expect(
        email.getByRole("button", { name: "Sign up for emails" }),
      ).toBeDisabled();
      await expect(email.getByLabel("Your email address")).toBeDisabled();
      await expect(
        email.getByText(/Please enable JavaScript to use this sign-up form/),
      ).toBeVisible();
    } finally {
      await context.close();
    }
  });

  test.describe("email and contact forms", () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(
        (key) => localStorage.setItem(key, "declined"),
        consentKey,
      );
    });

    test("email requires valid data and consent, then confirms a successful request", async ({
      page,
    }) => {
      const submissions: Array<Record<string, string>> = [];
      await mockJsonEndpoint(page, emailEndpoint, async (route) => {
        submissions.push(route.request().postDataJSON());
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: JSON.stringify({ ok: true }),
        });
      });
      await page.goto(`${baseUrl}/free-fridge-sheet`);
      const form = page.getByRole("form", {
        name: "Keep in touch, if you’d like.",
      });
      const email = form.getByLabel("Your email address");
      const button = form.getByRole("button", { name: "Sign up for emails" });

      await email.fill("not-an-email");
      await button.click();
      expect(submissions).toHaveLength(0);
      expect(
        await email.evaluate((input) => (input as HTMLInputElement).validity.valid),
      ).toBe(false);

      await email.fill("family@example.test");
      await button.click();
      expect(submissions).toHaveLength(0);
      await form.getByRole("checkbox").check();
      await button.click();
      await expect(form.getByRole("status")).toContainText("Your request was received");
      expect(submissions).toEqual([
        {
          email: "family@example.test",
          source: "fridge-sheet",
          consent: "yes",
          _gotcha: "",
        },
      ]);
      await expect(email).toHaveValue("");
      await expect(
        form.getByRole("link", { name: /Open the Parent's Fridge Sheet/ }),
      ).toHaveAttribute("href", "https://downloads.example.test/fridge.pdf");
    });

    test("email provider failure preserves the address and permits a successful retry", async ({
      page,
    }) => {
      let requests = 0;
      await mockJsonEndpoint(page, emailEndpoint, async (route) => {
        requests += 1;
        await route.fulfill({
          status: requests === 1 ? 422 : 200,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: JSON.stringify(
            requests === 1
              ? { errors: [{ message: "Rejected for this test" }] }
              : { success: true },
          ),
        });
      });
      await page.goto(`${baseUrl}/free-fridge-sheet`);
      const form = page.getByRole("form", {
        name: "Keep in touch, if you’d like.",
      });
      const email = form.getByLabel("Your email address");
      await email.fill("family@example.test");
      await form.getByRole("checkbox").check();
      await form.getByRole("button", { name: "Sign up for emails" }).click();
      await expect(form.getByRole("alert")).toContainText("could not send your request");
      await expect(email).toHaveValue("family@example.test");
      await expect(
        form.getByRole("link", { name: /Open the Parent's Fridge Sheet/ }),
      ).toHaveCount(0);
      await form.getByRole("button", { name: "Sign up for emails" }).click();
      await expect(form.getByRole("status")).toContainText("Your request was received");
      expect(requests).toBe(2);
    });

    test("contact validates input, preserves a failed message, and confirms a successful retry", async ({
      page,
    }) => {
      const submissions: Array<Record<string, string>> = [];
      await mockJsonEndpoint(page, contactEndpoint, async (route) => {
        submissions.push(route.request().postDataJSON());
        await route.fulfill({
          status: submissions.length === 1 ? 422 : 200,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: JSON.stringify(
            submissions.length === 1
              ? { errors: [{ message: "Rejected for this test" }] }
              : { ok: true },
          ),
        });
      });
      await page.goto(`${baseUrl}/contact`);
      const form = page.getByRole("form", { name: "Contact Caregiving Desk" });
      const name = form.getByLabel("Your name");
      const email = form.getByLabel("Your email address");
      const message = form.getByLabel("Your message");
      const button = form.getByRole("button", { name: "Send message" });
      await button.click();
      expect(submissions).toHaveLength(0);
      await name.fill("Alex Example");
      await email.fill("family@example.test");
      await message.fill("          ");
      await button.click();
      await expect(form.getByRole("alert")).toContainText("not just spaces");
      expect(submissions).toHaveLength(0);

      await message.fill("Can you share more about the printable formats?");
      await button.click();
      await expect(form.getByRole("alert")).toContainText("could not be sent");
      await expect(message).toHaveValue(
        "Can you share more about the printable formats?",
      );
      await button.click();
      await expect(form.getByRole("status")).toContainText("sent successfully");
      expect(submissions).toHaveLength(2);
      expect(submissions[1]).toEqual({
        name: "Alex Example",
        email: "family@example.test",
        message: "Can you share more about the printable formats?",
        _gotcha: "",
      });
      await expect(name).toHaveValue("");
      await expect(email).toHaveValue("");
      await expect(message).toHaveValue("");
    });

    test("contact rejects an HTTP 200 response without a successful acknowledgement", async ({
      page,
    }) => {
      await mockJsonEndpoint(page, contactEndpoint, (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: { "access-control-allow-origin": "*" },
          body: JSON.stringify({ errors: [{ message: "Validation failed" }] }),
        }),
      );
      await page.goto(`${baseUrl}/contact`);
      const form = page.getByRole("form", { name: "Contact Caregiving Desk" });
      await form.getByLabel("Your name").fill("Alex Example");
      await form.getByLabel("Your email address").fill("family@example.test");
      await form
        .getByLabel("Your message")
        .fill("A general question about your printable formats.");
      await form.getByRole("button", { name: "Send message" }).click();
      await expect(form.getByRole("alert")).toContainText("could not be sent");
      await expect(form.getByRole("status")).toHaveCount(0);
    });
  });

  test("analytics remains off until consent, remembers decline, and supports revocation", async ({
    page,
  }) => {
    let analyticsLoads = 0;
    await page.route(plausibleScript, async (route) => {
      analyticsLoads += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: "document.documentElement.dataset.analyticsLoaded = 'true';",
      });
    });
    await page.goto(baseUrl);
    const notice = page.getByRole("region", { name: "Analytics privacy preferences" });
    await expect(notice).toBeVisible();
    await expect(page.locator(`script[src="${plausibleScript}"]`)).toHaveCount(0);
    expect(analyticsLoads).toBe(0);
    await notice.getByRole("button", { name: "No thanks" }).click();
    await expect(notice).toHaveCount(0);
    await page.reload();
    await expect(notice).toHaveCount(0);
    expect(analyticsLoads).toBe(0);

    await page
      .getByRole("button", { name: "Analytics preferences", exact: true })
      .click();
    await expect(notice).toBeVisible();
    await notice.getByRole("button", { name: "Allow analytics" }).click();
    await expect.poll(() => analyticsLoads).toBe(1);
    await expect(page.locator("html")).toHaveAttribute("data-analytics-loaded", "true");
    await expect(notice).toHaveCount(0);

    await page
      .getByRole("button", { name: "Analytics preferences", exact: true })
      .click();
    await notice.getByRole("button", { name: "No thanks" }).click();
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-analytics-loaded",
      "true",
    );
    await expect(page.locator(`script[src="${plausibleScript}"]`)).toHaveCount(0);
    await expect(notice).toHaveCount(0);
    expect(analyticsLoads).toBe(1);
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), consentKey))
      .toBe("declined");
  });
});

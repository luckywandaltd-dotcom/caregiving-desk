import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { homepageExamples } from "../content/homepage-examples";
import { products } from "../content/products";
import { site } from "../content/site";
import { tips } from "../content/tips";

const coreRoutes = [
  "/",
  "/free-fridge-sheet",
  "/shop",
  "/tips",
  "/about",
  "/contact",
  "/medical-disclaimer",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/care",
  "/care/profiles",
  "/care/medications",
  "/care/appointments",
  "/care/checklist",
  "/care/notes",
  "/care/resources",
  "/care/data",
];
const productRoutes = products.map(({ slug }) => `/shop/${slug}`);
const tipRoutes = tips.map(({ slug }) => `/tips/${slug}`);
const routes = [...coreRoutes, ...productRoutes, ...tipRoutes];
const disclosure =
  "Content is for education only and is not medical advice. Always talk to your doctor or pharmacist about your health.";
const legalNotice = "Starter text – review with a professional before launch.";

async function readSchemas(page: Page) {
  return page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map(
        (script) => JSON.parse(script.textContent || "null") as Record<string, unknown>,
      ),
    );
}

test.describe("Pages, readable layouts, and disclosures", () => {
  for (const route of routes) {
    test(`${route} renders without errors or horizontal overflow`, async ({ page }) => {
      const runtimeErrors: string[] = [];
      page.on("pageerror", (error) => runtimeErrors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toContainText(disclosure);
      await expect(page.locator("img:not([alt])")).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);

      const layout = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        smallBodyCopy: [...document.querySelectorAll("p")]
          .filter((element) => {
            const box = element.getBoundingClientRect();
            return (
              box.width > 1 &&
              box.height > 1 &&
              getComputedStyle(element).visibility !== "hidden"
            );
          })
          .filter((element) => parseFloat(getComputedStyle(element).fontSize) < 18)
          .map((element) => element.textContent?.trim().slice(0, 100)),
      }));
      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(layout.smallBodyCopy, "Body paragraphs must be at least 18px").toEqual([]);
      expect(runtimeErrors).toEqual([]);

      const smallTargets = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            "a, button, summary, input:not([type='hidden']), textarea",
          ),
        ]
          .filter((element) => !element.hasAttribute("disabled"))
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              rect.width > 1 &&
              rect.height > 1
            );
          })
          .filter((element) => {
            const target =
              element instanceof HTMLInputElement && element.type === "checkbox"
                ? element.labels?.[0] || element
                : element;
            const rect = target.getBoundingClientRect();
            return rect.width < 48 || rect.height < 48;
          })
          .map((element) => ({
            name:
              element.getAttribute("aria-label") ||
              element.textContent?.trim().slice(0, 60),
            tag: element.tagName,
          })),
      );
      expect(
        smallTargets,
        "Interactive targets must be at least 48px in each dimension",
      ).toEqual([]);

      const schemas = await readSchemas(page);
      const organization = schemas.find((schema) => schema["@type"] === "Organization");
      expect(organization?.name).toBe("Caregiving Desk");
      expect(JSON.stringify(organization)).not.toMatch(
        /"@type":"(?:Physician|MedicalOrganization)"/,
      );
    });
  }
});

test("every page has distinct metadata, valid local links, and a sitemap entry", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Metadata and HTTP responses do not vary with viewport.",
  );
  test.setTimeout(90_000);
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const canonicals = new Set<string>();
  const linkedPaths = new Set<string>();
  const imagePaths = new Set<string>();
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const sitemap = await sitemapResponse.text();

  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(title.length).toBeGreaterThan(10);
    expect(description?.length).toBeGreaterThan(20);
    expect(canonical).toBeTruthy();
    expect(new URL(canonical!).pathname).toBe(route);
    expect(titles.has(title), `Duplicate title at ${route}`).toBe(false);
    expect(descriptions.has(description!), `Duplicate description at ${route}`).toBe(
      false,
    );
    expect(canonicals.has(canonical!), `Duplicate canonical at ${route}`).toBe(false);
    titles.add(title);
    descriptions.add(description!);
    canonicals.add(canonical!);
    expect(sitemap).toContain(`<loc>${canonical}</loc>`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /^https?:\/\//,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) =>
        anchors.map((anchor) => new URL((anchor as HTMLAnchorElement).href).pathname),
      );
    links.forEach((path) => linkedPaths.add(path));
    const images = await page
      .locator('img[src^="/"]')
      .evaluateAll((elements) =>
        elements.map((element) => (element as HTMLImageElement).getAttribute("src")!),
      );
    images.forEach((path) => imagePaths.add(path));
    await expect(page.locator('a[href*="PLACEHOLDER"]')).toHaveCount(0);
  }
  for (const route of routes)
    expect(linkedPaths.has(route), `${route} is not reachable from site links`).toBe(
      true,
    );
  for (const path of linkedPaths) {
    const response = await request.get(path);
    expect(response.ok(), `Broken internal link: ${path}`).toBe(true);
  }
  for (const path of imagePaths) {
    const response = await request.get(path);
    expect(response.ok(), `Missing local image: ${path}`).toBe(true);
    expect(response.headers()["content-type"]).toMatch(/^image\//);
  }
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  const ogUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  const ogImage = await request.get(new URL(ogUrl!).pathname);
  expect(ogImage.ok()).toBe(true);
  expect(ogImage.headers()["content-type"]).toMatch(/^image\//);
});

for (const route of [
  "/",
  "/free-fridge-sheet",
  "/shop",
  productRoutes[0],
  tipRoutes[0],
]) {
  test(`${route} meets automated WCAG 2.1 AA checks`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("keyboard users can skip the header and see focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  const focus = await skip.evaluate((element) => ({
    outline: getComputedStyle(element).outlineWidth,
    top: element.getBoundingClientRect().top,
  }));
  expect(parseFloat(focus.outline)).toBeGreaterThan(0);
  expect(focus.top).toBeGreaterThanOrEqual(0);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("the mobile menu supports keyboard opening, Escape, and navigation", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "The desktop header shows navigation directly.",
  );
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Shop", exact: true })
    .click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("tip filtering only lists categories that have articles", async ({ page }) => {
  await page.goto("/tips");
  const filter = page.getByRole("group", { name: "Filter tips by category" });
  const present = [...new Set(tips.map((tip) => tip.category))];
  await expect(filter.getByRole("button")).toHaveCount(present.length + 1);
  for (const category of present) {
    await expect(
      filter.getByRole("button", { name: category, exact: true }),
    ).toBeVisible();
  }
  for (const category of ["Myth vs Fact", "Seasonal"] as const) {
    if (!present.includes(category)) {
      await expect(
        filter.getByRole("button", { name: category, exact: true }),
      ).toHaveCount(0);
    }
  }
  const category = present[0];
  await filter.getByRole("button", { name: category, exact: true }).click();
  await expect(
    filter.getByRole("button", { name: category, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("main").getByRole("article")).toHaveCount(
    tips.filter((tip) => tip.category === category).length,
  );
  await expect(page.getByRole("status")).toContainText(category);
  await filter.getByRole("button", { name: "All tips", exact: true }).click();
  await expect(page.getByRole("main").getByRole("article")).toHaveCount(tips.length);
});

test("unconfigured forms explain availability and do not collect submissions", async ({
  page,
}) => {
  await page.goto("/free-fridge-sheet");
  const signup = page.getByRole("main").getByRole("form");
  await expect(signup).toContainText("not collecting email addresses yet");
  await expect(
    signup.getByRole("textbox", { name: "Your email address" }),
  ).toBeDisabled();
  await expect(signup.getByRole("button", { name: /sheet|email/i })).toBeDisabled();
  await expect(
    page.locator('input[type="password"], input[autocomplete="cc-number"]'),
  ).toHaveCount(0);

  await page.goto("/contact");
  const contact = page.getByRole("form", { name: "Contact Caregiving Desk" });
  await expect(contact).toContainText("contact form is coming soon");
  await expect(
    contact.getByRole("textbox", { name: "Your name", exact: true }),
  ).toBeDisabled();
  await expect(
    contact.getByRole("textbox", { name: "Your email address", exact: true }),
  ).toBeDisabled();
  await expect(
    contact.getByRole("textbox", { name: "Your message", exact: true }),
  ).toBeDisabled();
  await expect(contact.getByRole("button", { name: "Send message" })).toBeDisabled();
  await expect(
    page.locator('script[src*="plausible.io"], script[src*="googletagmanager.com"]'),
  ).toHaveCount(0);
});

test("coming-soon products never advertise purchasable offers or collect card details", async ({
  page,
}) => {
  for (const product of products.filter((item) => item.status === "coming-soon")) {
    await page.goto(`/shop/${product.slug}`);
    await expect(
      page.getByRole("main").getByRole("link", { name: /buy now/i }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Notify me", exact: true }),
    ).toBeDisabled();
    const schemas = await readSchemas(page);
    const schema = schemas.find((item) => item["@type"] === "Product");
    expect(schema?.name).toBe(product.title);
    expect(schema).not.toHaveProperty("offers");
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("review");
    if (product.legalNote)
      await expect(page.getByRole("main")).toContainText(product.legalNote);
  }
});

test("example tips show placeholders and never invent a medical author or sources", async ({
  page,
}) => {
  for (const tip of tips.filter((item) => item.example)) {
    await page.goto(`/tips/${tip.slug}`);
    await expect(page.getByRole("main")).toContainText(
      "EXAMPLE CONTENT – replace before launch",
    );
    await expect(
      page.getByRole("heading", { name: "Safety note: talk to your doctor if…" }),
    ).toBeVisible();
    await expect(page.locator('a[href*="PLACEHOLDER"]')).toHaveCount(0);
    await expect(page.locator("iframe")).toHaveCount(0);
    const schemas = await readSchemas(page);
    const article = schemas.find((item) => item["@type"] === "Article");
    expect(article?.headline).toBe(tip.title);
    expect(article?.author).toMatchObject({
      "@type": "Organization",
      name: "Caregiving Desk",
    });
    expect(article).not.toHaveProperty("reviewedBy");
    expect(article).not.toHaveProperty("datePublished");
  }
});

test("the homepage hero names the characters without the shared image caption", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator("main figure").first();
  await expect(hero.locator("img")).toHaveAttribute("alt", site.images.hero.alt);
  await expect(hero).toContainText("Dr. Bennett, George & Margaret");
  await expect(hero).not.toContainText(site.characterImageDisclosure);
  await expect(page.getByRole("main")).toContainText(
    "Dr. Bennett is an AI virtual presenter—not a real or licensed doctor.",
  );
  await expect(page.getByRole("contentinfo")).toContainText(disclosure);

  await page.goto("/about");
  await expect(page.getByRole("main")).toContainText(site.characterImageDisclosure);
  await expect(page.getByRole("main")).toContainText(
    "not a real person, a licensed doctor",
  );
  await expect(page.getByRole("contentinfo")).toContainText(disclosure);

  await page.goto("/medical-disclaimer");
  await expect(page.getByRole("main")).toContainText(
    "Dr. Bennett is a fictional AI virtual presenter, not a real or licensed doctor.",
  );
  await expect(page.getByRole("contentinfo")).toContainText(disclosure);
});

test("homepage topic cards show sourced examples without replacing the articles", async ({
  page,
}) => {
  await page.goto("/");
  const main = page.getByRole("main");
  await expect(main).toContainText("EXAMPLE CONTENT – replace before launch");
  await expect(main).toContainText(
    "The short lines under each card are separate examples for learning.",
  );
  for (const group of homepageExamples) {
    await expect(
      main.getByRole("heading", { name: `Examples for ${group.category}` }),
    ).toBeVisible();
    for (const example of group.examples) {
      await expect(main).toContainText(example.text);
      if (example.fictional) await expect(main).toContainText("Fictional example.");
      if (example.source) {
        const link = main.locator(`a[href="${example.source.url}"]`).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", example.source.url);
      }
    }
    for (const source of group.safetySources ?? []) {
      await expect(main.locator(`a[href="${source.url}"]`).first()).toBeVisible();
    }
  }
  await expect(main).toContainText(
    "Stop if activity causes dizziness, chest pain or pressure, or nausea.",
  );
  await expect(page.getByRole("contentinfo")).toContainText(disclosure);
});

test("legal pages retain the starter-text notice and About explains the AI presenter", async ({
  page,
}) => {
  for (const path of ["/medical-disclaimer", "/privacy", "/terms", "/refund-policy"]) {
    await page.goto(path);
    await expect(page.getByRole("main")).toContainText(legalNotice);
  }
  await page.goto("/about");
  await expect(page.getByRole("main")).toContainText(disclosure);
  await expect(page.getByRole("main")).toContainText(
    "not a real person, a licensed doctor",
  );
});

test("missing routes return 404 with useful navigation and the site disclosure", async ({
  page,
}) => {
  for (const path of [
    "/a-page-that-does-not-exist",
    "/shop/missing-printable",
    "/tips/missing-tip",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const main = page.getByRole("main");
    await expect(main.locator('a[href="/"]')).toBeVisible();
    await expect(main.locator('a[href="/tips"]')).toBeVisible();
    await expect(main.locator('a[href="/shop"]')).toBeVisible();
    await expect(page.getByRole("contentinfo")).toContainText(disclosure);
  }
});

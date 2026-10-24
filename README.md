# Caregiving Desk

A calm, accessible website for adults over 60 and the families who care for them. Caregiving Desk is a brand owned by Voice Of Peshawar LLC. Dr. Bennett is an AI virtual presenter, **not a real or licensed doctor**. The site provides education only, not medical advice.

Built with Next.js App Router, strict TypeScript, Tailwind CSS, and editable local content. There is no CMS, database, on-site payment processing, or server-side credential requirement. All five initial products are coming soon; all three tip articles are clearly labelled examples. **Complete [PLACEHOLDERS.md](./PLACEHOLDERS.md) before public launch.**

## Run locally

Use Node.js 20.9 or later (a current supported LTS release is recommended) and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Visit the address printed by Next.js. The application runs without provider configuration; unavailable signup, download, and contact features say so instead of pretending to work. Copy `.env.example` only if `.env.local` does not already exist. In a cloud environment with an unwritable home cache, prefix npm commands with `npm_config_cache=/workspace/.cache/npm`.

Production and quality commands:

```sh
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run start
```

`npx tsc --noEmit` is equivalent to `npm run typecheck`. Run `npm run format` to apply Prettier formatting. Use `npm install` only when intentionally changing dependencies, and commit the resulting lockfile. The normal reproducible installation command is `npm ci`.

## Structure

```text
app/                  App Router pages, metadata, sitemap, and robots
components/           Reusable UI, navigation, cards, forms, and analytics
content/site.ts       Brand details, social links, disclaimer, trusted organizations
content/products.ts   Product data and product-specific FAQs
content/tips.ts       Categories and editable tip articles
content/faqs.ts       General frequently asked questions
lib/                  SEO and integration helpers
public/images/        Local, replaceable illustrations and social-image placeholder
tailwind.config.ts    Design tokens, loaded by the Tailwind @config directive
```

Fonts are provided locally through `next/font` and the installed font packages, so rendering does not require visitors to contact a font service. Images use `next/image`. Keep body text at least 18px, controls at least 48px, visible keyboard focus, and WCAG AA contrast when changing the design.

## Edit a product

Add or edit an entry in `content/products.ts`. Each product needs a unique URL-safe `slug`, title, short description, `inside` bullets, intended audience, page count, format, price, status, checkout URL, image path and alt text, and FAQs. Cards and product routes read these fields directly; components do not need editing.

- Keep `status: "coming-soon"` until the real printable and external checkout are ready.
- Put the final Gumroad or Etsy HTTPS checkout URL in that product's `buyUrl`.
- Replace the placeholder price and page count with verified details.
- For an available product, set `status: "available"`. A valid checkout opens in a new tab; there are no card fields on this site.
- Add the cover to `public/images/` and use `/images/your-file.svg` (or another supported local format) with a useful `coverAlt` description.
- Keep the important-documents organizer's legal note: “This planner is not a legal document and does not replace a valid will.”
- Product notification forms pass their product context to the configured email service. Confirm that your provider supports that field or use its hosted signup page.

Rebuild after content changes so static routes, structured data, and the sitemap include the new entry.

## Edit a tip or FAQ

Add or edit an entry in `content/tips.ts`. Categories are Myth vs Fact, Chair Exercises, Food & Kitchen, Caregiver Stories, and Seasonal. Each article has a unique slug, title, summary, category, three or four plain-language points, a safety note, source links, image and alt text, publication date, and an `example` flag.

Before setting `example: false`, replace every placeholder, verify each health statement against the exact source page, add real source titles and HTTPS links, and set the actual publication date. Trusted sources are CDC, NIH, NIA, Mayo Clinic, and NHS. Their homepages are directories, not citations for a specific claim. Do not invent facts, statistics, credentials, quotations, testimonials, ratings, or sales figures. Do not diagnose, promise a cure, use scare language, or advise changing medicines. Keep necessary qualifications and topic-specific safety guidance.

An optional `embedUrl` supports a public YouTube video/Short or Instagram post URL. Use only content you have permission to share. The embed loads on request, without autoplay; visitors can also follow the source link. Check the published embed with the actual URL, because third-party privacy and embedding restrictions may prevent playback.

Edit general FAQs in `content/faqs.ts`; they appear in the accessible expandable FAQ section on About. Edit product FAQs in the relevant product's `faqs` array. Brand, social, and disclaimer copy lives in `content/site.ts`.

## Email signup and the free Fridge Sheet

All configuration is documented in [.env.example](./.env.example). Variables beginning with `NEXT_PUBLIC_` are **public, build-time settings**. Never put a private API key, secret, or subscriber export in them. Restart development after changing settings, and rebuild/redeploy production.

The email form supports these options:

1. **Generic public form action:** set `NEXT_PUBLIC_EMAIL_FORM_ACTION_URL` to your provider's HTTPS signup action. The default `NEXT_PUBLIC_EMAIL_FORM_MODE=native` uses a native browser POST and the provider's own confirmation page. Set `NEXT_PUBLIC_EMAIL_FIELD_NAME` to the documented email field name.
2. **A JSON endpoint you control:** set the mode to `json` only if the endpoint explicitly supports CORS requests from your site, accepts the form's JSON payload, and returns a 2xx JSON response containing `{"ok":true}` or `{"success":true}` with no `error`/`errors` after accepting the signup. Inline success/error states are available in this mode.
3. **Hosted signup:** leave the action blank and set `NEXT_PUBLIC_EMAIL_SIGNUP_URL` to a hosted subscription page or a free Gumroad product. The visitor completes signup or checkout with that provider.

For **ConvertKit (Kit)** or **MailerLite**, use the public action or hosted signup URL from the provider's form builder. Some forms use `email_address` or `fields[email]`, but the generated form is the authority. If the provider requires extra hidden fields, scripts, anti-bot tokens, or its own consent flow, use the hosted signup option rather than guessing its API. For a **free Gumroad product**, use the product's public hosted URL; Gumroad owns that checkout and delivery flow. No provider's private API is called by this site.

Create the actual two-page Parent's Fridge Sheet PDF before launch. Set `NEXT_PUBLIC_FRIDGE_SHEET_URL` to its public resource or hosted delivery URL; the default is the inert `PLACEHOLDER_FRIDGE_SHEET_URL`. To deliver the sheet only after signup, configure your email provider's confirmation/welcome automation or hosted product delivery. A public frontend URL is not access control and should not contain sensitive information. Test confirmation, consent, unsubscribe, and delivery with your chosen provider before launch.

## Contact form

Set `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` to a public Formspree-compatible HTTPS endpoint. It must accept CORS-enabled JSON POSTs containing name, email, message, and the `_gotcha` honeypot, and return a 2xx JSON response containing `{"ok":true}` or `{"success":true}` with no `error`/`errors` only when the message is accepted. Configure spam protection, allowed origins, destination email, and retention settings in the provider's dashboard. Validate an actual test message and a failed submission before launch. The website has no email delivery credentials or database.

## Analytics and privacy

Leave analytics variables empty to disable analytics and the cookie notice. Set **one** provider: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for the configured domain in Plausible, or `NEXT_PUBLIC_GA_MEASUREMENT_ID` for a Google Analytics `G-...` ID. The visitor must accept before the script loads. Declining keeps it disabled, and the footer preferences control reopens the choice. The choice is stored in the browser; review the configured service's retention, consent, and data settings.

Review all four starter legal pages with a qualified professional and align the privacy policy with the actual providers, jurisdictions, and practices. Do not claim compliance based only on the presence of a cookie notice.

## Deploy to Vercel

Import this Git repository into Vercel and select the detected Next.js framework. Use the repository root, the default `npm run build` command, and the default Next.js output settings; no `vercel.json` is needed. Set `NEXT_PUBLIC_SITE_URL` to the final public HTTPS origin and add the chosen public integration settings in Vercel's environment settings before building. Deployments must rebuild when these values or local content change.

Canonical URLs, Open Graph/Twitter metadata, the sitemap, and JSON-LD derive from the site origin. The fallback `https://example.com` is deliberately a launch placeholder. The default social image is the replaceable 1200 × 630 PNG at `public/images/og-default.png`; metadata uses `/images/og-default.png`. Verify the production domain, all static routes, the custom 404, `sitemap.xml`, `robots.txt`, social previews, contact delivery, signup confirmation, and any external checkout after deployment. This repository does not publish or configure a provider account automatically.

## Validation before launch

Run lint, type checking, formatting, and the production build. Browser tests use Chromium in desktop and mobile viewports. The test configuration uses `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if set, otherwise `/usr/bin/chromium` when installed, and otherwise Playwright's own browser. If no system browser is available, install the managed browser first:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

The test runner starts a production server on port 3000 if one is not already running. Use a fresh production build and avoid reusing an unrelated or stale server. Browser traces and screenshots are retained on failure; the HTML report is in `playwright-report/`. Test Home, Shop, a product page, and a tip page at phone and desktop sizes, with the keyboard, and using axe or Lighthouse. Aim for at least 90 in Lighthouse mobile Performance, Accessibility, Best Practices, and SEO; measured results depend on deployment and third-party configuration.

The optional `tests/integrations.spec.ts` suite is skipped by default. It exercises configured JSON signup/contact forms and analytics consent with **mocked** providers; it never submits to a real service. After the normal production build, start a separate development server in another terminal with these test-only public settings:

```sh
NEXT_PUBLIC_EMAIL_FORM_ACTION_URL=https://forms.example.test/email \
NEXT_PUBLIC_EMAIL_FORM_MODE=json \
NEXT_PUBLIC_EMAIL_FIELD_NAME=email \
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://forms.example.test/contact \
NEXT_PUBLIC_FRIDGE_SHEET_URL=https://downloads.example.test/fridge.pdf \
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.test \
NEXT_PUBLIC_GA_MEASUREMENT_ID= \
npm run dev -- --port 3001
```

Then run the isolated integration suite:

```sh
TEST_INTEGRATIONS=1 npm run test:e2e -- tests/integrations.spec.ts
```

`INTEGRATION_BASE_URL` can override the integration server's default `http://127.0.0.1:3001` address. Keep the mock endpoint values shown above because the test intercepts those exact destinations. These checks validate client behavior, validation, error handling, and consent; they do **not** verify a real provider account, actual email delivery, native provider confirmation, hosted signup, unsubscribe, or checkout. Test those manually with the selected providers before launch. Stop the test-configured development server afterward and never deploy its example settings.

Automated checks do not replace a content review, manual keyboard check, or testing the real external providers. Replace/remove example articles before launch and re-run checks after changing content, fonts, colors, or integrations.

# Validation results

## Free printable update — October 25, 2026

Added the user-supplied `Parents_Care_Information_Printable.pdf` as the free Parent's Fridge Sheet. The original two-page A4 PDF is retained byte-for-byte at `public/downloads/parents-care-information-printable.pdf` (68,394 bytes; SHA-256 `49b9bec13d9cbfa0f6c5d5d93279ee99012b4ca8c93a9172400d6c1b4528727b`). Both pages were inspected: they are blank print-and-complete templates, with no completed personal information. The first-page preview replaces the placeholder on Home and the free-sheet page. Downloading requires neither email signup nor JavaScript. The user's latest clarification keeps this resource free; paid-product prices and availability are unchanged.

- `npm run lint`, `npm run build`, `npm run typecheck`, `npm run format:check`, and `git diff --check`: passed.
- Affected production browser checks: **15 passed, 1 intentionally skipped** (duplicate mobile metadata/HTTP check). Coverage includes Home/free-sheet layout, site metadata and local assets, unavailable forms, keyboard navigation, and native PDF downloads at desktop/mobile sizes with JavaScript disabled. HTTP and downloaded bytes both match the packaged original.
- **Four axe WCAG 2.1 AA scans** across Home/free-sheet at desktop/mobile sizes: zero violations. These test the website, not the PDF. The supplied PDF is untagged; no accessible-PDF conformance is claimed.
- Additional preview/layout checks at **320px, 390px, and 1440px**: images loaded, no horizontal overflow, and no browser runtime errors. Desktop/mobile screenshots were visually inspected.
- Affected mock-provider integration checks: **6 passed** across desktop/mobile (no-JavaScript form safeguards, email validation/consent and success, failure/retry, and the HTTPS download override). These were mocked responses, not live subscriptions or email delivery.
- Lighthouse mobile on `/free-fridge-sheet`: **95/100/100/100** for Performance, Accessibility, Best Practices, and SEO. Reports are in `/tmp/caregiving-free-pdf-lighthouse/` in this cloud instance.

Deployment prerequisites were rechecked during this update: `VERCEL_TOKEN` is absent, its draft requirement has no saved credential binding, and the running environment has no Vercel network rules. The previously denied Vercel API operation was not retried without a relevant access change. No live deployment is established. The GitHub check-runs API was previously unavailable (Forbidden); these are local checks, not claims of hosted CI success. Remaining product files, checkout links, provider setup, production domain, tip content, and legal review are tracked in [PLACEHOLDERS.md](./PLACEHOLDERS.md).

## Character image update — October 25, 2026

Replaced the Home hero, presenter illustration, and About illustration with the user-approved AI-generated character images. All five supplied JPEG originals are retained byte-for-byte, including two reserve assets. The three active images have descriptive alt text and adjacent AI disclosures; the exact footer medical disclaimer is unchanged.

- `npm run lint`, `npm run build`, `npx tsc --noEmit`, and `npm run format:check`: passed.
- Affected existing Playwright checks: **11 passed, 1 intentionally skipped** (duplicate mobile metadata/HTTP test). These cover Home/About rendering, site metadata and image responses, keyboard focus, legal disclosures, and Home accessibility.
- Additional browser checks: the active images decoded successfully on Home/About at **320px, 390px, and 1440px**, with no horizontal overflow or browser runtime errors. Screenshots were visually inspected for framing and readable disclosures.
- **Four axe WCAG 2.1 AA scans** across Home/About at mobile and desktop sizes reported zero violations.
- Lighthouse mobile: **Home 97/100/100/100; About 99/100/100/100** for Performance, Accessibility, Best Practices, and SEO respectively. Reports are in `/tmp/caregiving-images-lighthouse/` in this cloud instance.

The running environment still has no `VERCEL_TOKEN` binding and no applied Vercel network rules. The earlier Vercel API request was denied; that denied request was not repeated without a relevant access change. This image update does not establish a live deployment. Actual products/PDFs, prices, checkout links, provider endpoints, the production domain, reviewed tips, and reviewed legal text remain launch prerequisites in [PLACEHOLDERS.md](./PLACEHOLDERS.md).

## Initial website verification — October 24, 2026

The results below record the initial website validation, before the character image update, using Node.js 24.19.0 and the local production build. They remain historical evidence for the initial implementation rather than new runs of unchanged checks.

## Build and code checks

| Command                                       | Result                                            |
| --------------------------------------------- | ------------------------------------------------- |
| `npm ci --no-audit --no-fund`                 | Reproducible lockfile installation passed         |
| `npm run lint`                                | Passed, zero ESLint warnings                      |
| `npm run build`                               | Passed; all content pages prerendered             |
| `npx tsc --noEmit`                            | Passed                                            |
| `npm run format:check`                        | Passed                                            |
| `npm audit --omit=dev --audit-level=moderate` | No production dependency vulnerabilities reported |

The cloud installation used `npm_config_cache=/workspace/.cache/npm` because the default home cache is not writable.

## Browser checks

`npm run test:e2e -- tests/site.spec.ts`: **60 passed, 2 intentionally skipped**. The desktop project skips the mobile-menu test; the mobile project skips duplicate metadata/HTTP checks. No required behavior was skipped.

Coverage includes all 18 content routes at 1440px desktop and 390px mobile widths; unknown top-level, product, and tip routes returning 404; internal links and local images; unique metadata and sitemap entries; AI disclosures; 18px body paragraphs; 48px interactive targets; keyboard focus and skip navigation; mobile menu and Escape; category filters and empty results; unavailable forms; legal banners; and honest Product/Article structured data.

The suite includes **eight axe WCAG 2.1 AA scans** across Home, Shop, the Family Care Binder product, and a chair-tip page at both viewports. All reported zero violations. Additional narrow-phone checks at 320px and 360px found no horizontal overflow.

`TEST_INTEGRATIONS=1 INTEGRATION_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/integrations.spec.ts`: **12 passed** across desktop and mobile. Provider requests were intercepted with mocks. Coverage includes input validation, email consent, accepted submissions, provider errors, retries, retained form data, the configured download link, analytics acceptance/decline/revocation, and safe behavior with JavaScript disabled. No real email subscriptions, messages, or analytics events were sent. Native provider POST and real delivery still require testing with the chosen provider.

Run suites sequentially or provide separate Playwright output directories. See [README.md](./README.md) for the production and configured integration server commands.

## Lighthouse mobile

Audits used Lighthouse's default mobile emulation and simulated throttling against the local production server, with optional analytics disabled.

| Page                       | Performance | Accessibility | Best Practices | SEO |
| -------------------------- | ----------: | ------------: | -------------: | --: |
| Home                       |          99 |           100 |            100 | 100 |
| Shop                       |          99 |           100 |            100 | 100 |
| Family Care Binder product |          97 |           100 |            100 | 100 |
| Chair routine example tip  |          99 |           100 |            100 | 100 |

Raw JSON and HTML reports from this run are in `/tmp/caregiving-lighthouse/` in the current cloud instance. Scores describe this build and test environment; rerun after deployment or changes to content, integrations, and assets. Automated scans do not establish that all accessibility issues are absent.

## Deployment and environment status

The application was started successfully in development and production modes, and representative HTTP requests returned the expected content. Reusable cloud `install_script` and `start_skill` instructions were saved as a configuration draft. Saving does not publish the cloud snapshot or deploy the website. The code is ready for Vercel's default Next.js configuration; no public deployment or live provider account was configured.

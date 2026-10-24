# Validation results

Validated on October 24, 2026 in the cloud workspace using Node.js 24.19.0 and the local production build. The application is implemented; the intentional content, product, and provider placeholders in [PLACEHOLDERS.md](./PLACEHOLDERS.md) still need attention before public launch.

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

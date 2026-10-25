# Working on Caregiving Desk

## Project and editing conventions

- Use the existing checkout. Cloud tasks already run in an isolated environment; do not create a Git worktree unless the user explicitly requests one.
- This is Next.js App Router with strict TypeScript and Tailwind CSS. Preserve the lockfile and use `npm ci` for reproducible setup.
- Keep shared UI in `components/`, helpers in `lib/`, and page routes in `app/`.
- Product entries belong in `content/products.ts`, tips and categories in `content/tips.ts`, general FAQs in `content/faqs.ts`, and brand/social/disclaimer content in `content/site.ts`.
- New content entries should create their cards and routes without component edits. Keep slugs unique. Generate static params, metadata, structured data, and sitemap entries from content.
- Keep images local in `public/images/`, use `next/image`, and write meaningful alt text. The user has approved the supplied AI-generated character images; they depict fictional people, not real identifiable people. Keep a readable AI disclosure beside realistic character images and identify their AI-generated nature in alt text. Use `next/font` with locally installed fonts.
- Do not add a CMS, database, on-site card fields, or heavy UI libraries without a clear task requirement. Purchases use external checkout URLs.

## Content rules

- Use Caregiving Desk as the public brand. Do not add owner or geographic attribution without approved public copy. Dr. Bennett is an AI virtual presenter, not a real or licensed doctor. George and Margaret are AI-generated fictional characters. Their clinic and outdoor scenes are fictional, not photographs of real consultations or patients. Never imply actual clinical credentials, patients, endorsements, or testimonials, including in metadata and JSON-LD.
- Content is education only. Do not diagnose, promise cures or miracle outcomes, use scare language, or advise someone to stop or change medicine. Tell readers to discuss personal health decisions with their doctor or pharmacist.
- Use exact, relevant CDC, NIH, NIA, Mayo Clinic, or NHS source pages for health statements. Do not invent facts, statistics, sources, quotations, reviews, ratings, credentials, or sales figures.
- Mark missing material with an obvious `PLACEHOLDER`. Keep the exact “EXAMPLE CONTENT – replace before launch” label on sample tips. A sample date is not proof of medical review.
- Keep the footer disclaimer on every page and the clear disclosure on About. Keep the legal-document warning on the important-documents organizer.
- Keep all initial products `coming-soon` until actual files, final details, and a valid external checkout are provided. Never turn a placeholder URL into an actionable purchase link.
- Keep each starter legal page's professional-review banner until the user supplies reviewed launch text. Do not invent business contact details, legal jurisdiction, policy dates, or refund guarantees.
- Update `PLACEHOLDERS.md` when adding or resolving launch requirements.

## Accessibility and privacy

- Body text is at least 18px. Preserve WCAG 2.1 AA contrast, minimum 48px control targets, visible focus, semantic headings, labelled forms, and complete keyboard navigation.
- Avoid autoplay, motion-heavy UI, inaccessible menu behavior, and color-only status indicators. Honor reduced-motion preferences.
- Forms must validate input and report actual outcomes. Missing configuration must never produce fake success or store an email silently.
- Never place secrets in `NEXT_PUBLIC_` variables, committed files, or frontend code. Public provider action URLs must use HTTPS. Do not log personal form submissions.
- Keep analytics off until configured and accepted by the visitor. Provide decline and a way to change the choice. Lazy-load third-party embeds only after an explicit visitor action.

## Commands and verification

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run test:e2e
```

`npx tsc --noEmit` is the explicit type-check equivalent. `npm run format` applies formatting. If the cloud home cache is unwritable, use `npm_config_cache=/workspace/.cache/npm` for npm commands.

Run checks appropriate to the change; investigate failures rather than weakening assertions. For layout or interactive changes, verify mobile and desktop, keyboard use, missing-provider states, and accessibility on representative pages. For changes to real integrations, verify provider success and failure without exposing submitted personal information. Never claim a provider, deployment, score, or test passed unless it was actually checked. Changes to public env variables require a rebuild/redeploy.

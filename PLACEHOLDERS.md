# Before Caregiving Desk launches

The codebase includes intentional launch placeholders. A successful build does not mean that content has been medically or legally reviewed, that products exist, or that external integrations are connected.

## Brand and website identity

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS site origin. Replace the `https://example.com` fallback for canonical URLs, sitemap, structured data, and social metadata.
- [ ] Review required business details for the legal pages and the public brand description in `content/site.ts`. Do not add owner or geographic attribution without approved public copy.
- [ ] Confirm the supplied social handles and their destinations: Instagram `@caregivingdesk`, X `@caregiverdesk`, TikTok `@luckywandallc`, YouTube `@Caregivingdesk`.
- [ ] Keep Dr. Bennett's AI-presenter description accurate on About and in character introductions. George and Margaret are AI-generated fictional characters, not real patients or people giving testimonials.

## Free Parent's Fridge Sheet and email signup

- [x] Add the supplied original at `public/downloads/parents-care-information-printable.pdf`: two blank A4 pages for parent details, allergies, contacts, medicines, and supplements. It is a print-and-complete resource, not an electronically fillable form.
- [x] Provide a direct free download with no signup required. `NEXT_PUBLIC_FRIDGE_SHEET_URL` is an optional valid HTTPS override; empty or invalid values use the packaged PDF. The user confirmed the printable is free for now; this does not finalize any paid-product prices.
- [x] Replace the illustrative preview with a faithful first-page rendering at `public/images/fridge-sheet-preview.png`, used on Home and the free-sheet page.
- [ ] Review the supplied printable's content and suitability before launch. Supplying the file does not establish medical or legal review. The original PDF is untagged; assess PDF accessibility and provide an accessible alternative as needed without claiming conformance based on website checks.
- [ ] If enabling optional email signup, choose ConvertKit/Kit, MailerLite, another supported form endpoint, or a hosted signup page. Set the public action or hosted signup URL, submission mode, and correct email field name. Signup is independent of the download.
- [ ] Before enabling signup, configure and test consent, confirmation, unsubscribe links, sender details, any required provider-specific fields, and any optional welcome/delivery automation. No real subscription or email delivery is available while these URLs are empty; the free direct download still works.

## Five planned products

Every entry in `content/products.ts` starts as `coming-soon`. Verify all descriptions, planned contents, audiences, FAQs, format, price/currency, and page counts against the actual files before changing a status to `available`.

| Product                                              | Placeholder checkout                            | Details to finalize                                                                                                                                             |
| ---------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Family Care Binder (Starter Edition)                 | `PLACEHOLDER_FAMILY_CARE_BINDER_BUY_URL`        | Approximately 25–30 pages and the suggested $12 price are explicitly placeholders; create the file and confirm both.                                            |
| “If Something Happens” Important Documents Organizer | `PLACEHOLDER_IMPORTANT_DOCUMENTS_BUY_URL`       | Final price, page count, content, legal review, and external checkout. Preserve the statement that it is not a legal document or a substitute for a valid will. |
| Chair Exercise Guide for Over-60s                    | `PLACEHOLDER_CHAIR_EXERCISE_GUIDE_BUY_URL`      | Final price, page count, routine cards, progress tracker, source checks, safety review, and checkout.                                                           |
| Moving a Parent to Assisted Living Checklist         | `PLACEHOLDER_ASSISTED_LIVING_CHECKLIST_BUY_URL` | Final price, page count, checklist contents, applicability, and checkout.                                                                                       |
| Home Safety and Fall Prevention Checklist            | `PLACEHOLDER_HOME_SAFETY_CHECKLIST_BUY_URL`     | Final price, page count, source-supported checklist, safety review, and checkout.                                                                               |

- [ ] Replace every `[PLANNED CONTENT]` and `[PLACEHOLDER: …]` field with verified product details.
- [ ] Create a real Gumroad or Etsy listing for each released product and paste the HTTPS URL into its `buyUrl`.
- [ ] Verify delivery, file readability/printing, checkout price, applicable taxes and currency, refund terms, and support route with the actual provider.
- [ ] Connect product notification signup before inviting people to subscribe.

## Three example tip articles

All initial tips carry **EXAMPLE CONTENT – replace before launch**. None supplies reviewed health guidance. Their sample dates are not dates of medical or source review.

| Slug                              | Missing source field                     |
| --------------------------------- | ---------------------------------------- |
| `a-gentle-chair-routine`          | `PLACEHOLDER_CHAIR_ROUTINE_SOURCE_URL`   |
| `a-little-comfort-in-the-kitchen` | `PLACEHOLDER_KITCHEN_TIP_SOURCE_URL`     |
| `making-space-for-caregivers`     | `PLACEHOLDER_CAREGIVER_STORY_SOURCE_URL` |

- [ ] Replace or remove all three example entries in `content/tips.ts` before launch.
- [ ] Provide original, accurate titles and summaries, three or four plain-language points, topic-specific safety notes, and actual publication dates.
- [ ] Replace every placeholder source label/URL with the exact relevant CDC, NIH, NIA, Mayo Clinic, or NHS page. Check each claim against the source. Organizational homepage links on About are not citations for these articles.
- [ ] Only set `example: false` after content and source review. Do not invent statistics, stories presented as real, testimonials, credentials, or quotations.
- [ ] If adding an optional `embedUrl`, confirm ownership/permission, public availability, embed support, no autoplay, and that the visible description matches the real video/post.

## Character images, remaining previews, and social image

The user has supplied and approved AI-generated brand images for Dr. Bennett, George, and Margaret. Their realistic appearance does not represent actual medical credentials, patients, consultations, or testimonials. Preserve the visible AI disclosures and accurate alt text when using them.

- [x] Replace the character illustration placeholders with the user-approved AI-generated images.
- Active images are `characters-outdoors-square.jpg` on Home (a 720 × 720 crop of the supplied `characters-outdoors.jpg`, which is still kept), `dr-bennett-portrait.jpg` in “Meet Dr. Bennett,” and `characters-clinic.jpg` on About. Their paths, alt text, and dimensions are editable through `site.images` in `content/site.ts`.
- The supplied `dr-bennett-outdoors.jpg` and `characters-conversation.jpg` originals are retained for future use; they are not missing launch assets.
- [ ] Keep the AI-generated nature clear beside character images, including the fictional clinic scenes.
- [x] Replace `fridge-sheet.svg` with `fridge-sheet-preview.png`, a faithful first-page preview of the supplied two-page printable.
- [ ] Product covers: `product-binder.svg`, `product-documents.svg`, `product-chair.svg`, `product-moving.svg`, `product-home.svg`.
- [ ] Tip artwork: `tip-chair.svg`, `tip-kitchen.svg`, `tip-caregiver.svg`.
- [ ] Default Open Graph/Twitter image placeholder `public/images/og-default.png` (1200 × 630): review the final artwork and verify real social previews. Metadata uses `/images/og-default.png`; preserve the path or update the metadata after replacement.
- [ ] Do not substitute photos of real identifiable people for the approved fictional characters.

## Contact and privacy

- [ ] Set `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` to the actual public Formspree-compatible endpoint. Test accepted and failed submissions, spam protection, allowed origins, delivery, and retention.
- [ ] Configure a genuine business support contact and privacy contact without inventing an address or email.
- [ ] If enabling analytics, choose and configure one provider, verify accept/decline and preference changes, and update the privacy text with actual practices. Leave both analytics settings empty otherwise.
- [ ] Confirm the actual hosting, email, contact, checkout, analytics, and embed providers and link their privacy policies where applicable.

## Starter legal pages

All four pages display **Starter text – review with a professional before launch.**

- [ ] `/medical-disclaimer`: review education-only wording, AI disclosure, personal-care guidance, emergency wording, and the correction process.
- [ ] `/privacy`: fill the explicit business contact/address, jurisdictions, effective date, actual service providers, processing locations, safeguards, retention, deletion procedures, access controls, legal bases, and rights-request process.
- [ ] `/terms`: fill the explicit effective date, required business details, governing jurisdiction, consumer notices, and professionally reviewed liability/dispute terms. Confirm the intended personal/family license.
- [ ] `/refund-policy`: fill the explicit checkout provider, request route, eligibility/window, handling of duplicate/defective purchases, applicable digital cancellation rights, and effective date. Mandatory consumer rights must remain respected.

## Final checks

- [ ] Rebuild after updating content or public environment variables. Pass lint, type checking, formatting, and the production build.
- [ ] Check all routes, mobile/desktop layout, keyboard navigation, screen-reader labels, 18px body text, 48px controls, contrast, and image alt text.
- [ ] Re-run browser accessibility tests and mobile Lighthouse after final assets/integrations are enabled. Verify production metadata, structured data, sitemap, robots, and the 404 page.
- [ ] Verify real signup/delivery, contact submission, checkout/delivery, unsubscribe, and consent workflows against the actual provider accounts.
- [ ] Search for `PLACEHOLDER`, `PLANNED CONTENT`, `EXAMPLE CONTENT`, `example.com`, and the starter legal banner; review every remaining match intentionally rather than hiding unfinished work.

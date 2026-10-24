import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Digital product refund policy",
  "Read the starter refund policy for Caregiving Desk printables, including external checkout policies, download problems, and consumer rights.",
  "/refund-policy",
);

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Digital product refund policy"
      introduction="Our planned products are downloadable files, not physical items. This policy must be finalized with the actual checkout provider and applicable consumer law before sales begin."
      sections={[
        {
          title: "Before you buy",
          content: (
            <p>
              Read the product description, file format, page count, printing
              requirements, and final price on the checkout page. Products marked “Coming
              soon” cannot be purchased here. Placeholder descriptions and prices are
              drafts and must be confirmed before a product is made available.
            </p>
          ),
        },
        {
          title: "Which policy applies",
          content: (
            <p>
              The final product listing and checkout provider will explain refund
              eligibility, deadlines, and any lawful conditions for access to digital
              content. This draft does not impose a blanket “no refunds” rule. Any
              mandatory consumer rights under applicable law remain in place and take
              priority over conflicting policy wording.
            </p>
          ),
        },
        {
          title: "Problems with a file or purchase",
          content: (
            <p>
              If a file is inaccessible, appears damaged, is different from the purchased
              description, or a duplicate payment appears, use the support route on your
              order receipt or the checkout platform. Include the order reference and a
              brief description of the issue. Do not send card details, passwords, or
              private health information.
            </p>
          ),
        },
        {
          title: "Requesting help or a refund",
          content: (
            <p>
              Begin with the provider that processed your payment. Once our contact form
              is enabled, you may also ask Caregiving Desk for help with a product. We
              cannot promise an outcome or processing time until the issue and the
              applicable provider rules are reviewed.
            </p>
          ),
        },
        {
          title: "Details to complete before launch",
          content: (
            <p>
              [PLACEHOLDER: confirm the checkout provider, refund request address or link,
              eligibility and request window, handling of duplicate or defective
              purchases, applicable cancellation rights for digital content, and effective
              date. Obtain professional review.]
            </p>
          ),
        },
      ]}
    />
  );
}

import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Terms of use",
  "Read the starter terms for using Caregiving Desk, its educational content, downloadable printables, and external checkout links.",
  "/terms",
);

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      introduction="These starter terms explain the intended use of Caregiving Desk and its digital resources. Review the final terms and product details before using a resource or making a purchase."
      sections={[
        {
          title: "Who we are and what we offer",
          content: (
            <p>
              Caregiving Desk is a brand owned by Voice Of Peshawar LLC. We provide
              general educational content and printable planning tools for adults and
              caregivers. Dr. Bennett is an AI virtual presenter, not a real or licensed
              doctor. Our content is not medical, legal, financial, or other personalized
              professional advice.
            </p>
          ),
        },
        {
          title: "Use the site responsibly",
          content: (
            <p>
              You may read the site for personal purposes. Do not misuse forms, attempt
              unauthorized access, interfere with the service, or use it unlawfully. You
              are responsible for making sure a resource suits your needs and for seeking
              qualified advice when appropriate.
            </p>
          ),
        },
        {
          title: "Digital products and personal use",
          content: (
            <p>
              Unless a product’s final listing states otherwise, a download is intended
              for personal and family caregiving use. You may print copies for that
              purpose. You may not resell, publicly redistribute, or claim ownership of
              our original materials. Ownership of the underlying content is not
              transferred by a purchase. Any third-party material remains subject to its
              own rights.
            </p>
          ),
        },
        {
          title: "External checkout and availability",
          content: (
            <p>
              Purchases take place through the external provider linked from an available
              product. That provider displays the final price, currency, taxes where
              applicable, payment terms, and delivery details. Products marked “Coming
              soon” are not available to buy; placeholder prices are not offers. Follow
              the checkout provider’s terms as well as the final product listing.
            </p>
          ),
        },
        {
          title: "Accuracy, access, and links",
          content: (
            <p>
              We aim to present information clearly but cannot promise that every page
              will always be complete, current, or available. External websites are
              operated independently. A link to a trusted organization is not an
              endorsement by that organization. Example content and starter legal pages
              must be replaced or reviewed before launch.
            </p>
          ),
        },
        {
          title: "Your legal rights",
          content: (
            <p>
              Nothing in these starter terms is intended to exclude rights or remedies
              that cannot be excluded under applicable law. Any limitations of
              responsibility, governing-law terms, dispute process, and consumer notices
              must be reviewed for the business and its customers before launch.
            </p>
          ),
        },
        {
          title: "Details to complete before launch",
          content: (
            <p>
              [PLACEHOLDER: add the effective date, business contact and required address,
              governing jurisdiction, applicable consumer notices, and professionally
              reviewed liability and dispute terms.] Contact us through the contact page
              for general questions once the form service is enabled.
            </p>
          ),
        },
      ]}
    />
  );
}

import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Privacy policy",
  "Read the starter privacy policy for Caregiving Desk, covering optional email signup, contact forms, analytics choices, and external services.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      introduction="We want you to understand what you share, why it is used, and which choices are yours. This starter policy must be updated to match the services enabled at launch."
      sections={[
        {
          title: "Who is responsible",
          content: (
            <>
              <p>
                Use the Caregiving Desk contact page for privacy questions once the
                contact service is enabled.
              </p>
              <p>
                [PLACEHOLDER: add the business privacy contact, postal address where
                required, applicable jurisdictions, and the policy’s effective date before
                launch.]
              </p>
            </>
          ),
        },
        {
          title: "Information you choose to send",
          content: (
            <p>
              If enabled, the email signup form sends your email address and signup
              context to our selected email service. The contact form sends your name,
              email address, and message to our selected form service. Do not send health
              records, medicine lists, financial details, or other sensitive information
              through these forms. Details you write on a downloaded printable are not
              sent to us by this website.
            </p>
          ),
        },
        {
          title: "How information is used",
          content: (
            <p>
              Information submitted through a signup form is used to deliver the updates
              or resource described beside that form. Contact details are used to respond
              to your message. Service providers may process technical information such as
              an IP address to operate their services and help prevent abuse. We do not
              collect card details on this website; purchases take place on a separate
              checkout provider’s site.
            </p>
          ),
        },
        {
          title: "Services and international processing",
          content: (
            <>
              <p>
                Hosting, forms, email delivery, and checkout may involve service providers
                with their own privacy policies and processing locations. Follow the
                relevant provider’s privacy notice before submitting information or buying
                a product. Optional third-party video embeds are loaded only after you
                choose to load them.
              </p>
              <p>
                [PLACEHOLDER: identify the actual hosting, email, contact-form, checkout,
                and analytics providers; their policy links; processing locations; and any
                required transfer safeguards.]
              </p>
            </>
          ),
        },
        {
          title: "Analytics and your choice",
          content: (
            <p>
              Optional analytics are disabled unless configured. When analytics are
              enabled, we ask before loading them. Accepting allows the configured
              analytics service to measure site use; declining keeps it off. Your choice
              is stored in your browser. Use the analytics preferences control in the
              footer to change it. Third-party websites you visit have their own cookie
              and privacy settings.
            </p>
          ),
        },
        {
          title: "Keeping and protecting information",
          content: (
            <>
              <p>
                We should keep personal information only for the purposes described here
                and for any applicable legal obligations. No online service can promise
                complete security. Avoid sending information you would not want handled by
                the configured service providers.
              </p>
              <p>
                [PLACEHOLDER: set and document retention periods, deletion procedures,
                access controls, and the legal bases required in your operating
                jurisdictions.]
              </p>
            </>
          ),
        },
        {
          title: "Your requests and email preferences",
          content: (
            <p>
              You may unsubscribe using the link in marketing emails. Depending on where
              you live, you may have rights to request access, correction, deletion,
              restriction, portability, or to object to certain processing. Use the
              business privacy contact added before launch to make a request. Some
              requests may require identity verification or be limited by law.
            </p>
          ),
        },
        {
          title: "Audience and changes",
          content: (
            <p>
              This site is intended for adults, not children. We may update this policy
              when our services or obligations change. The launch version must include an
              effective date and explain how material changes will be communicated when
              required.
            </p>
          ),
        },
      ]}
    />
  );
}

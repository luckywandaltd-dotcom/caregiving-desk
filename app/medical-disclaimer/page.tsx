import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Medical disclaimer",
  "Understand the education-only purpose of Caregiving Desk and the AI-presenter disclosure. This site does not provide medical advice.",
  "/medical-disclaimer",
);

export default function MedicalDisclaimerPage() {
  return (
    <LegalPage
      title="Medical disclaimer"
      introduction={site.disclaimer}
      sections={[
        {
          title: "Education, not personal advice",
          content: (
            <p>
              Our pages, social posts, videos, and printable products offer general
              educational information. They do not diagnose, treat, or prevent any
              condition, and they do not replace advice from a qualified healthcare
              professional who knows your circumstances. Reading this site does not create
              a clinician–patient relationship.
            </p>
          ),
        },
        {
          title: "About Dr. Bennett and our characters",
          content: (
            <p>
              Dr. Bennett is a fictional AI virtual presenter, not a real or licensed
              doctor. His name does not represent a medical qualification. George and
              Margaret are fictional characters. Their appearances and stories are not
              medical credentials, testimonials, or reports from real patients.
            </p>
          ),
        },
        {
          title: "Make health decisions with your care team",
          content: (
            <p>
              Talk to your doctor or pharmacist about your own health, medicines,
              movement, and dietary needs. Do not stop, start, or change a medicine
              because of something on this site. Ask your healthcare professional whether
              an activity or suggestion is appropriate for you.
            </p>
          ),
        },
        {
          title: "Urgent concerns",
          content: (
            <p>
              Caregiving Desk is not an emergency service. Our contact form and social
              accounts are not monitored for urgent medical needs. If you need urgent
              help, contact your local emergency service or an appropriate healthcare
              service.
            </p>
          ),
        },
        {
          title: "Sources, examples, and corrections",
          content: (
            <p>
              Health guidance can change and general guidance may not fit every person.
              Check the original source and seek personal advice when needed. Pages marked
              “EXAMPLE CONTENT – replace before launch” contain placeholder copy and are
              not reviewed health guidance. Please use our contact page to report an
              error; do not include private medical records.
            </p>
          ),
        },
      ]}
    />
  );
}

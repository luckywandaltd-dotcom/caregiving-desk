import type { FAQ } from "./faqs";

export type Product = {
  slug: string;
  title: string;
  shortTitle?: string;
  shortDescription: string;
  inside: string[];
  audience: string;
  pageCount: string;
  format: "Printable PDF";
  price: string;
  status: "available" | "coming-soon";
  buyUrl: string;
  coverImage: string;
  coverAlt: string;
  faqs: FAQ[];
  legalNote?: string;
  color?: string;
};

const printableFaq: FAQ = {
  question: "Is this a physical book?",
  answer:
    "No. This is a planned printable PDF. When it is released, you will be able to download and print it yourself. Nothing is shipped.",
};

const launchFaq: FAQ = {
  question: "When will this be available?",
  answer:
    "A release date has not been announced. This is a preview of a planned product, and its contents, page count, and price are not final. Use Notify me to request an update once the email service is connected.",
};

export const products: Product[] = [
  {
    slug: "family-care-binder",
    title: "Caregiving Desk Family Care Binder (Starter Edition)",
    shortTitle: "Family Care Binder",
    shortDescription:
      "A place for the details you want close at hand, from everyday notes to the people you can call.",
    inside: [
      "[PLANNED CONTENT] Key information and emergency contact sheets",
      "[PLANNED CONTENT] Medicine-list pages to complete with accurate, current information",
      "[PLANNED CONTENT] Appointment notes and questions for the care team",
      "[PLANNED CONTENT] Family contact lists and shared-care notes",
      "[PLANNED CONTENT] Simple dividers to make the binder your own",
    ],
    audience:
      "Adult children, family caregivers, and older adults who want a practical place to organize everyday care information.",
    pageCount: "[PLACEHOLDER: about 25–30 pages planned]",
    format: "Printable PDF",
    price: "[PLACEHOLDER: $12 suggested price]",
    status: "coming-soon",
    buyUrl: "PLACEHOLDER_FAMILY_CARE_BINDER_BUY_URL",
    coverImage: "/images/product-binder.svg",
    coverAlt:
      "Illustrated placeholder cover for the Family Care Binder, Starter Edition.",
    color: "sage",
    faqs: [
      printableFaq,
      {
        question: "Does this replace my parent's medical record?",
        answer:
          "No. It is a planning and note-taking tool. Ask your parent's care team about medical records and confirm medicine information with their doctor or pharmacist. Do not change a medicine based on a printable.",
      },
      launchFaq,
    ],
  },
  {
    slug: "important-documents-organizer",
    title: "“If Something Happens” Important Documents Organizer",
    shortTitle: "Important Documents Organizer",
    shortDescription:
      "A thoughtful starting point for noting where important papers are kept and who your family should contact.",
    inside: [
      "[PLANNED CONTENT] Important-document location lists",
      "[PLANNED CONTENT] Family and professional contact pages",
      "[PLANNED CONTENT] Notes for conversations with the people you trust",
      "[PLANNED CONTENT] A space to list questions for a qualified legal professional",
    ],
    audience:
      "Families who want to organize practical information and prepare for conversations about important documents.",
    pageCount: "[PLACEHOLDER: final page count to be confirmed]",
    format: "Printable PDF",
    price: "[PLACEHOLDER: price to be confirmed]",
    status: "coming-soon",
    buyUrl: "PLACEHOLDER_IMPORTANT_DOCUMENTS_BUY_URL",
    coverImage: "/images/product-documents.svg",
    coverAlt:
      "Illustrated placeholder cover for the If Something Happens Important Documents Organizer.",
    legalNote: "This planner is not a legal document and does not replace a valid will.",
    color: "sand",
    faqs: [
      printableFaq,
      {
        question: "Can this replace a will or other legal document?",
        answer:
          "No. This planner is not a legal document and does not replace a valid will. Speak with a qualified legal professional about documents and requirements that apply to you.",
      },
      launchFaq,
    ],
  },
  {
    slug: "chair-exercise-guide",
    title: "Chair Exercise Guide for Over-60s",
    shortTitle: "Chair Exercise Guide",
    shortDescription:
      "A planned collection of routine cards and a progress tracker, designed to support conversations about suitable movement.",
    inside: [
      "[PLANNED CONTENT] Routine cards with instructions to be reviewed and sourced before release",
      "[PLANNED CONTENT] A simple progress tracker",
      "[PLANNED CONTENT] Questions to discuss with your doctor or physical therapist",
      "[PLANNED CONTENT] Safety notes and links to reviewed source material",
    ],
    audience:
      "Older adults and family caregivers looking for a printable way to organize an appropriate, professionally discussed movement routine.",
    pageCount: "[PLACEHOLDER: final page count to be confirmed]",
    format: "Printable PDF",
    price: "[PLACEHOLDER: price to be confirmed]",
    status: "coming-soon",
    buyUrl: "PLACEHOLDER_CHAIR_EXERCISE_GUIDE_BUY_URL",
    coverImage: "/images/product-chair.svg",
    coverAlt: "Illustrated placeholder cover for the Chair Exercise Guide for Over-60s.",
    color: "sage",
    faqs: [
      printableFaq,
      {
        question: "Is this a personal exercise plan?",
        answer:
          "No. The planned guide is for education only. Ask your doctor or physical therapist what movement is appropriate for you before starting or changing a routine.",
      },
      launchFaq,
    ],
  },
  {
    slug: "assisted-living-checklist",
    title: "Moving a Parent to Assisted Living Checklist",
    shortTitle: "Assisted Living Checklist",
    shortDescription:
      "Room for the practical details and the personal preferences that matter during a family move.",
    inside: [
      "[PLANNED CONTENT] Questions for a visit or tour",
      "[PLANNED CONTENT] Packing and personal-belongings lists",
      "[PLANNED CONTENT] Contact and appointment planning pages",
      "[PLANNED CONTENT] A place to note your parent's preferences and next steps",
    ],
    audience:
      "Older adults and their families who are considering or planning a move to assisted living.",
    pageCount: "[PLACEHOLDER: final page count to be confirmed]",
    format: "Printable PDF",
    price: "[PLACEHOLDER: price to be confirmed]",
    status: "coming-soon",
    buyUrl: "PLACEHOLDER_ASSISTED_LIVING_CHECKLIST_BUY_URL",
    coverImage: "/images/product-moving.svg",
    coverAlt:
      "Illustrated placeholder cover for the Moving a Parent to Assisted Living Checklist.",
    color: "sand",
    faqs: [
      printableFaq,
      {
        question: "Does this recommend a care facility?",
        answer:
          "No. This is a planning tool, not a recommendation or assessment of any facility. Discuss your family's needs with appropriate care professionals and ask each facility about its services and terms.",
      },
      launchFaq,
    ],
  },
  {
    slug: "home-safety-checklist",
    title: "Home Safety and Fall Prevention Checklist",
    shortTitle: "Home Safety Checklist",
    shortDescription:
      "A planned room-by-room companion for noting questions and discussing home safety with a qualified professional.",
    inside: [
      "[PLANNED CONTENT] Room-by-room observation pages",
      "[PLANNED CONTENT] A space for questions about everyday household tasks",
      "[PLANNED CONTENT] Follow-up notes and a family task list",
      "[PLANNED CONTENT] Reviewed safety information and source links to be added before release",
    ],
    audience:
      "Older adults and families who want to prepare for a conversation about safety at home.",
    pageCount: "[PLACEHOLDER: final page count to be confirmed]",
    format: "Printable PDF",
    price: "[PLACEHOLDER: price to be confirmed]",
    status: "coming-soon",
    buyUrl: "PLACEHOLDER_HOME_SAFETY_CHECKLIST_BUY_URL",
    coverImage: "/images/product-home.svg",
    coverAlt:
      "Illustrated placeholder cover for the Home Safety and Fall Prevention Checklist.",
    color: "sage",
    faqs: [
      printableFaq,
      {
        question: "Does completing this guarantee a safe home?",
        answer:
          "No. A checklist cannot guarantee safety or replace an individual assessment. Ask a qualified professional about your parent's home and needs.",
      },
      launchFaq,
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

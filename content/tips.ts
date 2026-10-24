export const categories = [
  "Myth vs Fact",
  "Chair Exercises",
  "Food & Kitchen",
  "Caregiver Stories",
  "Seasonal",
] as const;

export type TipCategory = (typeof categories)[number];

export type Tip = {
  slug: string;
  title: string;
  summary: string;
  category: TipCategory;
  points: string[];
  safetyNote: string;
  sources: { label: string; url: string }[];
  image: string;
  imageAlt: string;
  publishedAt: string;
  example: boolean;
  embedUrl?: string;
};

export const exampleContentLabel = "EXAMPLE CONTENT – replace before launch";

// Dates identify these sample entries, not a medical review or source publication.
// Replace each sample with reviewed content and its actual publication date.
export const tips: Tip[] = [
  {
    slug: "a-gentle-chair-routine",
    title: "A gentle chair routine, one step at a time",
    summary:
      "EXAMPLE CONTENT – replace before launch. A preview of a future chair-movement article. Exercise instructions and reviewed source links have not been added.",
    category: "Chair Exercises",
    points: [
      "[PLACEHOLDER: introduce the topic without promising a health outcome.]",
      "[PLACEHOLDER: add a clearly explained movement only after checking an appropriate trusted source.]",
      "[PLACEHOLDER: add source-supported guidance about suitability and when to stop.]",
      "[PLACEHOLDER: add a simple takeaway and link it to the reviewed source.]",
    ],
    safetyNote:
      "Talk to your doctor if you are unsure whether an activity is appropriate for you. This example does not contain an exercise routine. [PLACEHOLDER: add and review the topic-specific safety note before launch.]",
    sources: [
      {
        label: "[PLACEHOLDER: reviewed source title and organization]",
        url: "PLACEHOLDER_CHAIR_ROUTINE_SOURCE_URL",
      },
    ],
    image: "/images/tip-chair.svg",
    imageAlt:
      "Illustration of an empty chair and a leafy plant, used as a placeholder for a chair exercise article.",
    publishedAt: "2026-10-24",
    example: true,
  },
  {
    slug: "a-little-comfort-in-the-kitchen",
    title: "A little comfort in the kitchen",
    summary:
      "EXAMPLE CONTENT – replace before launch. A preview of a future food-and-kitchen article. No recipe, nutrition claim, or advice about swallowing is provided in this example.",
    category: "Food & Kitchen",
    points: [
      "[PLACEHOLDER: introduce the food idea in plain language, without a health claim.]",
      "[PLACEHOLDER: add the reviewed ingredients and preparation steps.]",
      "[PLACEHOLDER: add source-supported food safety and individual dietary considerations.]",
      "[PLACEHOLDER: add a practical takeaway with an appropriate reviewed source.]",
    ],
    safetyNote:
      "Talk to your doctor if you have questions about food choices or swallowing. This example is not a recipe or dietary recommendation. [PLACEHOLDER: add and review the topic-specific safety note before launch.]",
    sources: [
      {
        label: "[PLACEHOLDER: reviewed source title and organization]",
        url: "PLACEHOLDER_KITCHEN_TIP_SOURCE_URL",
      },
    ],
    image: "/images/tip-kitchen.svg",
    imageAlt:
      "Illustration of a bowl and berries, used as a placeholder for a future food and kitchen article.",
    publishedAt: "2026-10-24",
    example: true,
  },
  {
    slug: "making-space-for-caregivers",
    title: "Making space for the person who cares",
    summary:
      "EXAMPLE CONTENT – replace before launch. A preview of a future caregiver story. No real person's experience, testimonial, or quotation is included.",
    category: "Caregiver Stories",
    points: [
      "[PLACEHOLDER: introduce a clearly labelled fictional scenario or an authorized, accurate personal story.]",
      "[PLACEHOLDER: describe the situation without inventing a quotation or testimonial.]",
      "[PLACEHOLDER: add a practical reflection without implying a medical outcome.]",
      "[PLACEHOLDER: check any health-related statement and include its specific trusted source.]",
    ],
    safetyNote:
      "Talk to your doctor if you have concerns about your health or the health of the person you care for. This example contains no personal advice. [PLACEHOLDER: add and review the topic-specific safety note before launch.]",
    sources: [
      {
        label: "[PLACEHOLDER: reviewed source title and organization, if needed]",
        url: "PLACEHOLDER_CAREGIVER_STORY_SOURCE_URL",
      },
    ],
    image: "/images/tip-caregiver.svg",
    imageAlt:
      "Illustration of two mugs and a notebook, used as a placeholder for a future caregiver story.",
    publishedAt: "2026-10-24",
    example: true,
  },
];

export function getTip(slug: string): Tip | undefined {
  return tips.find((tip) => tip.slug === slug);
}

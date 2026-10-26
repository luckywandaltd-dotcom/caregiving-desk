import type { TipCategory } from "@/content/tips";

export type ExampleSource = {
  /** Short visible label, such as "NHS" or "NIA". */
  name: string;
  /** Distinguishes links that share the same organization name. */
  detail: string;
  url: string;
};

export type HomepageExample = {
  text: string;
  /** Caregiver scenes are stories, not health claims. */
  fictional?: boolean;
  source?: ExampleSource;
};

export type HomepageExampleGroup = {
  category: TipCategory;
  examples: HomepageExample[];
  /** Safety framing for movement examples. */
  safety?: string;
  safetySources?: ExampleSource[];
};

const nhsSitting: ExampleSource = {
  name: "NHS",
  detail: "sitting exercises, hip marching and ankle stretch",
  url: "https://www.nhs.uk/live-well/exercise/sitting-exercises/",
};

const nhsStrength: ExampleSource = {
  name: "NHS",
  detail: "strength exercises, sit-to-stand",
  url: "https://www.nhs.uk/live-well/exercise/strength-exercises/",
};

const niaActivitySafety: ExampleSource = {
  name: "NIA",
  detail: "three types of exercise, safety tips",
  url: "https://www.nia.nih.gov/health/exercise-and-physical-activity/three-types-exercise-can-improve-your-health-and-physical",
};

// Sentences stay faithful to the linked pages. They are education, not a personal plan.
export const homepageExamples: HomepageExampleGroup[] = [
  {
    category: "Chair Exercises",
    examples: [
      {
        text: "While seated, hold the sides of a solid chair and lift one knee at a time only as far as is comfortable, then place that foot down with control.",
        source: { ...nhsSitting, detail: "sitting exercises, hip marching" },
      },
      {
        text: "While seated, straighten one leg and point the toes away, then point them back toward you.",
        source: { ...nhsSitting, detail: "sitting exercises, ankle stretch" },
      },
      {
        text: "Sit on the edge of a sturdy chair, lean slightly forward, stand up slowly using your legs, and sit back down slowly, using your hands only to guide you if you need them.",
        source: nhsStrength,
      },
    ],
    safety:
      "If you are not sure a movement suits you, check with your doctor or another health professional involved in your care. Use a solid, stable chair that does not have wheels. Stop if activity causes dizziness, chest pain or pressure, or nausea.",
    safetySources: [
      {
        name: "NHS",
        detail:
          "sitting exercises, check with a health professional and choose a stable chair",
        url: nhsSitting.url,
      },
      niaActivitySafety,
    ],
  },
  {
    category: "Food & Kitchen",
    examples: [
      {
        text: "Drink fluids through the day, because you may feel less thirsty as you get older, and ask your doctor what and when to drink if bladder control is a concern.",
        source: {
          name: "NIH",
          detail: "NIDDK health tips for older adults, fluids",
          url: "https://www.niddk.nih.gov/health-information/weight-management/healthy-eating-physical-activity-for-life/health-tips-for-older-adults",
        },
      },
      {
        text: "Include vegetables, beans, or peas in meals — they are an important source of fiber.",
        source: {
          name: "NIA",
          detail: "healthy eating food groups, vegetables and fiber",
          url: "https://www.nia.nih.gov/health/healthy-eating-nutrition-and-diet/healthy-eating-you-age-know-your-food-groups",
        },
      },
      {
        text: "Refrigerate perishable food, including cooked leftovers, within 2 hours, or within 1 hour if it is hotter than 90°F.",
        source: {
          name: "CDC",
          detail: "preventing food poisoning, refrigerate promptly",
          url: "https://www.cdc.gov/food-safety/prevention/index.html",
        },
      },
    ],
  },
  {
    category: "Caregiver Stories",
    examples: [
      {
        fictional: true,
        text: "Margaret and George sit at the kitchen table and fill a weekly pill organizer together, reading each label out loud.",
      },
      {
        fictional: true,
        text: "After helping George get ready for the morning, Margaret sits with a book while he makes the tea.",
      },
      {
        text: "A short walk, a little gardening, or another activity you enjoy can be one small way to look after yourself while you care for someone else.",
        source: {
          name: "NIA",
          detail: "taking care of yourself as a caregiver, short periods of activity",
          url: "https://www.nia.nih.gov/health/caregiving/taking-care-yourself-tips-caregivers",
        },
      },
    ],
  },
];

export function examplesForCategory(category: TipCategory) {
  return homepageExamples.find((group) => group.category === category);
}

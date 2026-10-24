export const site = {
  name: "Caregiving Desk",
  owner: "Voice Of Peshawar LLC",
  description:
    "Simple, education-only caregiving resources for older adults and the families who care. Meet Dr. Bennett, an AI virtual presenter, and explore printable tools for everyday care.",
  disclaimer:
    "Dr. Bennett is an AI virtual presenter. Content is for education only and is not medical advice. Always talk to your doctor or pharmacist about your health.",
  presenterDisclosure:
    "Dr. Bennett is an AI virtual presenter, not a real person or a licensed doctor. George and Margaret are fictional illustrated characters. They help tell our stories; they are not patients or people giving testimonials.",
  fridgeSheetUrl:
    process.env.NEXT_PUBLIC_FRIDGE_SHEET_URL || "PLACEHOLDER_FRIDGE_SHEET_URL",
  socials: [
    {
      name: "Instagram",
      handle: "@caregivingdesk",
      url: "https://www.instagram.com/caregivingdesk/",
    },
    {
      name: "X",
      handle: "@caregiverdesk",
      url: "https://x.com/caregiverdesk",
    },
    {
      name: "TikTok",
      handle: "@luckywandallc",
      url: "https://www.tiktok.com/@luckywandallc",
    },
    {
      name: "YouTube",
      handle: "@Caregivingdesk",
      url: "https://www.youtube.com/@Caregivingdesk",
    },
  ],
  trustedSources: [
    { name: "CDC", url: "https://www.cdc.gov/" },
    { name: "NIH", url: "https://www.nih.gov/" },
    { name: "National Institute on Aging", url: "https://www.nia.nih.gov/" },
    { name: "Mayo Clinic", url: "https://www.mayoclinic.org/" },
    { name: "NHS", url: "https://www.nhs.uk/" },
  ],
} as const;

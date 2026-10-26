export const site = {
  name: "Caregiving Desk",
  presenterIntroduction: "Meet Dr. Bennett, your guide to everyday caregiving.",
  description:
    "Simple, education-only caregiving resources for older adults and the families who care. Meet Dr. Bennett, an AI virtual presenter, and explore printable tools for everyday care.",
  disclaimer:
    "Content is for education only and is not medical advice. Always talk to your doctor or pharmacist about your health.",
  presenterDisclosure:
    "Dr. Bennett is an AI virtual presenter, not a real person or a licensed doctor. George and Margaret are AI-generated fictional characters. Their images depict fictional scenes, not real patients, consultations, or testimonials.",
  characterImageDisclosure:
    "AI-generated fictional characters. Dr. Bennett is not a real or licensed doctor.",
  images: {
    hero: {
      src: "/images/characters-outdoors-square.jpg",
      alt: "AI-generated scene of Dr. Bennett, George, and Margaret, fictional characters standing together outdoors.",
      width: 720,
      height: 720,
    },
    presenter: {
      src: "/images/dr-bennett-portrait.jpg",
      alt: "AI-generated portrait of Dr. Bennett, a fictional virtual presenter wearing glasses and a white coat, not a real or licensed doctor.",
      width: 1086,
      height: 1448,
    },
    about: {
      src: "/images/characters-clinic.jpg",
      alt: "AI-generated scene of Dr. Bennett, George, and Margaret, fictional characters standing together in a clinic setting, not real patients or a consultation.",
      width: 720,
      height: 1280,
    },
    symbol: {
      src: "/images/care-desk-symbol.jpg",
      alt: "AI-generated portrait used as the Care desk symbol. Dr. Bennett is a fictional virtual presenter, not a real or licensed doctor.",
      width: 1500,
      height: 844,
    },
  },
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

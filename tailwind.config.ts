import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        cream: "#f8f7f2",
        paper: "#fffefa",
        ink: "#273b32",
        muted: "#58685e",
        sage: "#e8eee4",
        forest: "#355c47",
        border: "#d5ddd1",
        clay: "#ead9c6",
      },
      fontFamily: {
        sans: ["var(--font-atkinson)", "Arial", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      spacing: { "18": "4.5rem", "22": "5.5rem" },
    },
  },
} satisfies Config;

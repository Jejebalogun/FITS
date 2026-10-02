import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1E3E33",
          deep: "#132922",
          card: "#2A4F42",
        },
        cream: "#F7EFE3",
        sand: "#EAE0CA",
        sage: "#D8E0D4",
        clay: {
          DEFAULT: "#C05B28",
          deep: "#A84E20",
          soft: "#CD7B4F",
          wash: "#F3DCCB",
        },
        moss: "#7D9B7A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        page: "76rem",
      },
    },
  },
  plugins: [],
};
export default config;

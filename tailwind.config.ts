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
        "bg-cream": "#FDFBF7",
        "brand-primary": "#2D4A3E",
        "brand-accent": "#C88A4B",
        "text-main": "#222222",
      },
      fontFamily: {
        serif: ["var(--font-heading)", "Playfair Display", "serif"],
        sans: ["var(--font-body)", "Be Vietnam Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

import { Lora, Newsreader, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";

export const lora = Lora({
  subsets: ["vietnamese", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
});

export const newsreader = Newsreader({
  subsets: ["vietnamese", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-newsreader",
});

export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["vietnamese", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mono",
});

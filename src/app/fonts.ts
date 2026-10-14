// src/app/fonts.ts
import { Fraunces, Be_Vietnam_Pro } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["vietnamese", "latin-ext"],
  axes: ["opsz", "SOFT"],
  display: "swap",
  variable: "--font-fraunces",
});

export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam",
});

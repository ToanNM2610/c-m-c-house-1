"use client";

import SplitTextReveal from "./transitions/SplitTextReveal";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

/**
 * BlurText — Cầu nối tương thích cho SplitTextReveal chuẩn transitions.dev
 */
export default function BlurText(props: BlurTextProps) {
  return <SplitTextReveal {...props} />;
}

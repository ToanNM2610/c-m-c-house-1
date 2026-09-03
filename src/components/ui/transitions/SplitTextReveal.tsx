"use client";

import { motion, Variants } from "framer-motion";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

/**
 * SplitTextReveal — Sourced from transitions.dev pattern 18 (Texts reveal)
 * Staggered blurred rise for stacked text words/lines, settling cleanly into place.
 * Motion tokens: --duration-very-slow (500ms), --stagger-stagger (40ms), --stagger-distance (12px), --stagger-blur (3px)
 */
export default function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  as = "h1",
}: SplitTextRevealProps) {
  const words = text ? text.split(" ") : [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04, // var(--duration-stagger) = 40ms
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 12, // var(--distance-medium) = 12px
      filter: "blur(3px)", // var(--blur-medium) = 3px
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5, // var(--duration-very-slow) = 500ms
        ease: [0.22, 1, 0.36, 1], // var(--ease-smooth-out)
      },
    },
  };

  const Component = motion[as] as any;

  return (
    <Component
      key={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={containerVariants}
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-[0.1em] ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          className="inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

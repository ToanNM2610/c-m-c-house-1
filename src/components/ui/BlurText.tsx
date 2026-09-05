"use client";

import { motion, Variants } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export default function BlurText({
  text,
  className = "",
  delay = 0,
  as = "h1",
}: BlurTextProps) {
  const words = text ? text.split(" ") : [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: {
      y: "110%",
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1],
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
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.28em] gap-y-[0.08em] overflow-hidden ${className}`}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden py-1">
          <motion.span
            variants={childVariants}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}

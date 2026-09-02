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
      y: 50,
      clipPath: "inset(0 0 100% 0)",
    },
    visible: {
      y: 0,
      clipPath: "inset(0 0 0 0)",
      transition: {
        duration: 1,
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
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-[0.1em] ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={childVariants}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

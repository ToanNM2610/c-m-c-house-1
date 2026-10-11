"use client";

import { motion } from "framer-motion";

interface StaggerTextProps {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export default function StaggerText({
  lines,
  as: Component = "h2",
  className = "",
  lineClassName = "",
  delay = 0.05,
  stagger = 0.1, // Chuẩn stagger 0.1s theo yêu cầu
  once = true,
}: StaggerTextProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    hidden: {
      opacity: 0,
      y: 28,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1] as const, // Smooth cubic-bezier
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "0px" }}
        className="block"
      >
        {lines.map((line, idx) => (
          <span key={idx} className="block overflow-hidden py-0.5">
            <motion.span
              variants={lineVariants}
              className={`block transform-gpu ${lineClassName}`}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * Helper component cho đoạn văn bản giới thiệu (Paragraph)
 */
export function StaggerParagraph({
  text,
  className = "",
  delay = 0.1,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  return (
    <StaggerText
      lines={lines.length > 0 ? lines : [text]}
      as="p"
      className={className}
      delay={delay}
      stagger={0.1}
    />
  );
}

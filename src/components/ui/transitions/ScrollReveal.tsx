"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
}

/**
 * ScrollReveal — Sourced from transitions.dev motion tokens
 * Tự động kích hoạt khi cuộn chuột tới vùng nhìn thấy của trình duyệt.
 * Motion tokens: --duration-slow (400ms), --ease-smooth-out, --distance-medium (16px)
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 16,
  duration = 0.45,
}: ScrollRevealProps) {
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { x: 0, y: distance };
      case "down":
        return { x: 0, y: -distance };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // var(--ease-smooth-out)
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

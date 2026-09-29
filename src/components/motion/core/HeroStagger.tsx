"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { EASINGS } from "../tokens";

export interface HeroStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = { staggerDelay: 0.12, delayChildren: 0.1 }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delayChildren,
    },
  }),
};

export const heroItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: EASINGS.cinematic,
    },
  },
};

/**
 * HeroStagger (Effect 8):
 * Coordinates cascading entrance animations for hero sections.
 */
export default function HeroStagger({
  children,
  staggerDelay = 0.12,
  delayChildren = 0.1,
  className = "",
}: HeroStaggerProps) {
  return (
    <motion.div
      variants={containerVariants}
      custom={{ staggerDelay, delayChildren }}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={heroItemVariants}
      style={{ willChange: "transform, opacity, filter" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

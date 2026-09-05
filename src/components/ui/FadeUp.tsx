"use client";

import { motion, Variants } from "framer-motion";

interface FadeUpGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function FadeUpGroup({
  children,
  className = "",
  stagger = 0.05,
  delay = 0.1,
}: FadeUpGroupProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeUpItemProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}

export function FadeUpItem({
  children,
  className = "",
  yOffset = 25,
}: FadeUpItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  stagger?: number; // default 40ms (--duration-stagger)
  delay?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // var(--ease-smooth-out)
    },
  },
};

export function StaggerGrid({
  children,
  className = "",
  stagger = 0.04, // 40ms
  delay = 0.05,
}: StaggerGridProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={containerVariants(stagger, delay)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

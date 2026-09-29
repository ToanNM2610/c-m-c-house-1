"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASINGS } from "../tokens";

export interface AccordionMotionProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * AccordionMotion (Effect 15):
 * Auto-height expansion transition for dropdowns, drawers, and collapsibles.
 */
export default function AccordionMotion({
  isOpen,
  children,
  className = "",
}: AccordionMotionProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              height: { duration: 0.4, ease: EASINGS.cinematic },
              opacity: { duration: 0.3, delay: 0.1 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3, ease: EASINGS.cinematic },
              opacity: { duration: 0.2 },
            },
          }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";

export interface AuroraBackgroundProps {
  className?: string;
}

/**
 * AuroraBackground (Effect 19):
 * Atmospheric glowing blobs orbiting smoothly via GPU hardware transforms.
 */
export default function AuroraBackground({ className = "" }: AuroraBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-40 select-none ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 70, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute -top-36 -left-36 w-[550px] h-[550px] rounded-full bg-[#C88A4B]/20 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 0.9, 1.2],
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-1/3 -right-36 w-[500px] h-[500px] rounded-full bg-[#3B2F2F]/25 blur-[130px]"
      />
    </div>
  );
}

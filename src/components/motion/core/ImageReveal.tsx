"use client";

import React from "react";
import { motion } from "framer-motion";
import { EASINGS } from "../tokens";

export interface ImageRevealProps {
  children: React.ReactNode;
  aspectRatio?: string;
  curtainColor?: string;
  delay?: number;
  className?: string;
}

/**
 * ImageReveal (Effect 10):
 * Curtain wipe revealing imagery with optical dolly zoom.
 */
export default function ImageReveal({
  children,
  aspectRatio = "aspect-[16/9]",
  curtainColor = "#0C0D0B",
  delay = 0,
  className = "",
}: ImageRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={`relative overflow-hidden ${aspectRatio} ${className}`}
    >
      {/* Wipe Curtain */}
      <motion.div
        variants={{
          hidden: { scaleX: 1 },
          visible: {
            scaleX: 0,
            transition: {
              duration: 0.9,
              delay,
              ease: EASINGS.dramatic,
            },
          },
        }}
        style={{
          originX: 0,
          backgroundColor: curtainColor,
          willChange: "transform",
        }}
        className="absolute inset-0 z-20 pointer-events-none"
      />

      {/* Optical Scale Effect */}
      <motion.div
        variants={{
          hidden: { scale: 1.14, filter: "blur(6px)" },
          visible: {
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: 1.1,
              delay: delay + 0.1,
              ease: EASINGS.cinematic,
            },
          },
        }}
        style={{ willChange: "transform, filter" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

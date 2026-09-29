"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { EASINGS, DURATIONS } from "../tokens";

export type RevealVariant =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur";

export interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reveal: Unified wrapper for (2) Fade, (3) Slide, (4) Scale, (5) Blur, (6) Scroll Reveal
 * Runs on GPU-accelerated transform & opacity only, ensuring 60-120 FPS.
 */
export default function Reveal({
  children,
  variant = "slide-up",
  delay = 0,
  duration = DURATIONS.base,
  distance = 36,
  once = true,
  className = "",
  style = {},
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  const getVariants = (): Variants => {
    const baseInitial = { opacity: 0 };
    const baseAnimate = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: EASINGS.cinematic,
      },
    };

    switch (variant) {
      case "slide-up":
        return {
          initial: { ...baseInitial, y: distance },
          animate: baseAnimate,
        };
      case "slide-down":
        return {
          initial: { ...baseInitial, y: -distance },
          animate: baseAnimate,
        };
      case "slide-left":
        return {
          initial: { ...baseInitial, x: distance },
          animate: baseAnimate,
        };
      case "slide-right":
        return {
          initial: { ...baseInitial, x: -distance },
          animate: baseAnimate,
        };
      case "scale":
        return {
          initial: { ...baseInitial, scale: 0.92 },
          animate: baseAnimate,
        };
      case "blur":
        return {
          initial: { ...baseInitial, filter: "blur(14px)", scale: 0.98 },
          animate: baseAnimate,
        };
      case "fade":
      default:
        return {
          initial: baseInitial,
          animate: baseAnimate,
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={getVariants()}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      style={{
        willChange: "transform, opacity, filter",
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

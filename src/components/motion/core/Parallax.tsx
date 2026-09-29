"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SPRINGS } from "../tokens";

export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // Positive values move in scroll direction, negative move opposite
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Parallax (Effect 7):
 * Fluid GPU-accelerated vertical parallax based on element scroll progress.
 */
export default function Parallax({
  children,
  speed = 0.25,
  className = "",
  style = {},
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  const y = useSpring(rawY, SPRINGS.gentle);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} style={style}>
      <motion.div style={{ y, willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}

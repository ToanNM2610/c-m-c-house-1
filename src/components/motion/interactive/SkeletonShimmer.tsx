"use client";

import React from "react";
import { motion } from "framer-motion";

export interface SkeletonShimmerProps {
  className?: string;
  rounded?: string;
}

/**
 * SkeletonShimmer (Effect 17):
 * GPU-accelerated skeleton shimmer loop without layout thrashing.
 */
export default function SkeletonShimmer({
  className = "w-full h-6",
  rounded = "rounded-lg",
}: SkeletonShimmerProps) {
  return (
    <div
      className={`relative overflow-hidden bg-white/5 border border-white/5 ${rounded} ${className}`}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)",
          willChange: "transform",
        }}
        className="absolute inset-0"
      />
    </div>
  );
}

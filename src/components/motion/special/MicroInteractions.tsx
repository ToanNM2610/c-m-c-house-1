"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { SPRINGS } from "../tokens";

/**
 * Micro-interaction 1: Heart Like Button with elastic pop
 */
export function LikeButton({
  defaultLiked = false,
  onChange,
  className = "",
}: {
  defaultLiked?: boolean;
  onChange?: (liked: boolean) => void;
  className?: string;
}) {
  const [liked, setLiked] = useState(defaultLiked);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    onChange?.(next);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.82 }}
      onClick={toggle}
      className={`p-3 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors ${className}`}
      aria-label="Like"
    >
      <motion.div
        animate={
          liked
            ? { scale: [1, 1.45, 1], rotate: [0, -15, 15, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.4 }}
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-300 ${
            liked ? "fill-[#C88A4B] text-[#C88A4B]" : "text-white/70"
          }`}
        />
      </motion.div>
    </motion.button>
  );
}

/**
 * Micro-interaction 2: SVG Path Draw Animated Checkmark
 */
export function AnimatedCheckmark({
  size = 28,
  color = "#C88A4B",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      className={className}
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        stroke={color}
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M14 27l8 8 16-16"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}

/**
 * Micro-interaction 3: iOS-style Elastic Spring Toggle
 */
export function SmoothToggle({
  isOn,
  onToggle,
  className = "",
}: {
  isOn: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isOn ? "bg-[#C88A4B]" : "bg-white/10"
      } ${className}`}
    >
      <motion.div
        layout
        transition={SPRINGS.snappy}
        className="w-4 h-4 bg-white rounded-full shadow-md"
      />
    </div>
  );
}

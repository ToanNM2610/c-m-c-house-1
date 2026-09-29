"use client";

import React, { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { SPRINGS } from "../tokens";

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  magneticPull?: number;
  className?: string;
}

/**
 * MagneticButton (Effect 12):
 * Physics-based spring attraction towards cursor position.
 */
export default function MagneticButton({
  children,
  magneticPull = 0.35,
  className = "",
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, SPRINGS.magnetic);
  const y = useSpring(0, SPRINGS.magnetic);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    x.set((e.clientX - cx) * magneticPull);
    y.set((e.clientY - cy) * magneticPull);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y, willChange: "transform" }}
      whileTap={{ scale: 0.94 }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

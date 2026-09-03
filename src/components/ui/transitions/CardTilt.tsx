"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max degrees, default 8
}

/**
 * CardTilt — Sourced from transitions.dev pattern 19 (Card hover tilt)
 * 3D tilt toward pointer on hover with subtle radial cursor glare.
 * Motion tokens: --tilt-perspective (1000px), --ease-smooth-out
 */
export default function CardTilt({
  children,
  className = "",
  maxTilt = 8,
}: CardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative [perspective:1000px] ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full will-change-transform"
      >
        {children}

        {/* Cursor glare effect */}
        <motion.div
          animate={{ opacity: isHovered ? 0.25 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: useTransform(
              [springX, springY],
              ([gx, gy]: any[]) =>
                `radial-gradient(circle 300px at ${gx * 100}% ${gy * 100}%, rgba(197, 168, 128, 0.5), transparent 70%)`
            ),
          }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
        />
      </motion.div>
    </div>
  );
}

"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { SPRINGS } from "../tokens";

export interface TiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  glareOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TiltCard (Effect 11):
 * 3D perspective mouse tilt with dynamic light glare overlay.
 */
export default function TiltCard({
  children,
  maxTilt = 10,
  glareOpacity = 0.2,
  className = "",
  style = {},
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const rotateX = useSpring(0, SPRINGS.snappy);
  const rotateY = useSpring(0, SPRINGS.snappy);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateX.set(((y - centerY) / centerY) * -maxTilt);
    rotateY.set(((x - centerX) / centerX) * maxTilt);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: 1200, ...style }} className="relative">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
      >
        {children}

        {/* Dynamic Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35), transparent 80%)`,
          }}
        />
      </motion.div>
    </div>
  );
}

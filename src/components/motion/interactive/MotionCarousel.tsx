"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface MotionCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemGap?: number;
}

/**
 * MotionCarousel (Effect 16):
 * Drag-scrollable carousel track with momentum physics and boundary limits.
 */
export default function MotionCarousel({
  children,
  className = "",
  itemGap = 24,
}: MotionCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        setDragConstraint(Math.min(0, containerWidth - trackWidth));
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [children]);

  return (
    <div ref={containerRef} className={`overflow-hidden w-full cursor-grab active:cursor-grabbing ${className}`}>
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: dragConstraint, right: 0 }}
        dragElastic={0.12}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 25 }}
        style={{ willChange: "transform", gap: `${itemGap}px` }}
        className="flex"
      >
        {children}
      </motion.div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export interface HoverMediaItem {
  image: string;
  name: string;
}

export default function HoverMediaReveal({
  activeItem,
}: {
  activeItem: HoverMediaItem | null;
}) {
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window
    );

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Tắt trên màn hình cảm ứng hoặc mobile
  if (isTouchDevice) return null;

  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0, scale: 0.65, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.65, rotate: 4 }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          className="fixed top-0 left-0 pointer-events-none z-[9990] w-64 h-80 rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[#120805]"
        >
          <img
            src={activeItem.image}
            alt={activeItem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0705]/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-center">
            <span className="text-[11px] font-serif font-bold text-[#F4EFEA] tracking-wider line-clamp-1">
              {activeItem.name}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

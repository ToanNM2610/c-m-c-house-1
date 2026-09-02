"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Compass } from "lucide-react";

export default function Hero3DCoffeeBean() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const springConfig = { stiffness: 220, damping: 25, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[340px] sm:max-w-[400px] h-[340px] sm:h-[400px] mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Background Radial Light (Pure CSS radial-gradient, no CPU blur filter) */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(197, 168, 128, 0.15) 0%, rgba(74, 93, 78, 0.1) 45%, transparent 70%)",
        }}
      />

      {/* 3D Tilting Card Canvas with GPU-accelerated transforms */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        animate={{
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full h-full rounded-3xl p-6 flex flex-col items-center justify-center border border-[#C5A880]/30 bg-gradient-to-b from-[#25150E] via-[#1A0F0A] to-[#120A07] shadow-2xl overflow-hidden"
      >
        {/* Ambient Orbit Lines */}
        <div 
          className="absolute inset-4 rounded-full border border-dashed border-[#C5A880]/20 pointer-events-none animate-[spin_40s_linear_infinite]"
          style={{ transform: "translateZ(20px)" }}
        />

        {/* Layer 1: Glowing Golden Backing Disc */}
        <div 
          className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#C5A880]/15 to-[#4A5D4E]/15 pointer-events-none"
          style={{ transform: "translateZ(35px)" }}
        />

        {/* Layer 2: 3D Coffee Bean Sculpt */}
        <div 
          className="relative w-36 h-48 sm:w-44 sm:h-56 flex items-center justify-center"
          style={{ transform: "translateZ(75px)" }}
        >
          {/* Coffee Bean Outer Body */}
          <div className="relative w-32 h-44 sm:w-36 sm:h-50 rounded-[45%_55%_50%_50%/50%_50%_50%_50%] bg-gradient-to-br from-[#4A2511] via-[#2A140A] to-[#120703] shadow-[inset_0_4px_12px_rgba(197,168,128,0.3),0_15px_30px_rgba(0,0,0,0.8)] border border-[#C5A880]/40 flex items-center justify-center overflow-hidden transform -rotate-12 transition-transform duration-500">
            
            {/* Center Crease */}
            <div className="absolute w-1.5 sm:w-2 h-full bg-gradient-to-b from-transparent via-[#100603] to-transparent shadow-inner">
              <div className="w-full h-full bg-[#0d0502] rounded-full"></div>
            </div>

            {/* Roasted Gloss Highlight */}
            <div className="absolute top-3 left-3 w-14 h-24 rounded-full bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-70 pointer-events-none transform -rotate-15"></div>

            {/* Micro Gold Particle Sparkles */}
            <div className="absolute bottom-4 right-4 text-[#C5A880] opacity-80">
              <Sparkles size={16} />
            </div>
          </div>
        </div>

        {/* Layer 3: Artisan Kraft Badge with Floating Depth */}
        <div 
          className="mt-4 px-4 py-1.5 rounded-full bg-[#2A170F] border border-[#C5A880]/50 shadow-md flex items-center gap-2"
          style={{ transform: "translateZ(105px)" }}
        >
          <Compass size={14} className="text-[#C5A880]" />
          <span className="text-[11px] font-sans tracking-widest uppercase font-semibold text-[#F4EFEA]">
            {t("home.coffeeBeanLabel")}
          </span>
        </div>

        {/* Sub-label */}
        <p 
          className="text-[10px] text-[#F4EFEA]/70 font-light text-center mt-2 tracking-wide max-w-[260px]"
          style={{ transform: "translateZ(90px)" }}
        >
          {t("home.coffeeBeanDesc")}
        </p>

        {/* Interactive Tilt Hint */}
        <div 
          className="absolute bottom-2 text-[9px] uppercase tracking-widest text-[#C5A880]/60 font-sans flex items-center gap-1 opacity-70"
          style={{ transform: "translateZ(50px)" }}
        >
          <span>{t("home.heroInteractivePrompt")}</span>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PageTransitionCurtainProps {
  onComplete?: () => void;
}

export default function PageTransitionCurtain({ onComplete }: PageTransitionCurtainProps) {
  return (
    <motion.div
      key="page-curtain"
      initial={{ y: "0%" }}
      animate={{ y: "-100%" }}
      transition={{
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1] as const, // Cinematic cubic-bezier
        delay: 0.08,
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[#3E2723] text-[#FDFBF7] shadow-2xl"
    >
      {/* Texture mộc tự nhiên & viền vàng kem */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(93,64,55,0.4)_0%,rgba(62,39,35,0.95)_100%)] opacity-80" />

      {/* Huy hiệu Cẩm Cù House giữa màn che */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <div className="w-12 h-12 rounded-full border border-amber-300/40 bg-amber-950/40 flex items-center justify-center text-amber-200 mb-3 shadow-lg shadow-black/30">
          <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#FDFBF7] uppercase drop-shadow-md">
          Cẩm Cù House
        </h2>

        <p className="text-[10px] sm:text-xs font-sans tracking-[0.25em] text-stone-300 uppercase mt-1">
          coffee & food • Gia Nghĩa
        </p>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-200/50 to-transparent mt-3" />
      </motion.div>
    </motion.div>
  );
}

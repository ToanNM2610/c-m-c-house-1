"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTransitionContext } from "@/context/TransitionContext";

interface PageTransitionCurtainProps {
  onComplete?: () => void;
}

export default function PageTransitionCurtain({ onComplete }: PageTransitionCurtainProps) {
  const { mode, direction, clickCoords } = useTransitionContext();

  // Nếu là chế độ thuần Cross-Fade mộc mạc, không cần vẽ màn che bao phủ
  if (mode === "cross-fade") {
    return null;
  }

  // Chế độ 3: Slide ngang Next / Prev (Trượt ngược chiều khi quay lại)
  if (mode === "slide-directional") {
    const isNext = direction >= 0;
    const initialX = "0%";
    const exitX = isNext ? "-100%" : "100%";

    return (
      <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden">
        {/* Panel 1: Nâu Robusta */}
        <motion.div
          initial={{ x: initialX }}
          animate={{ x: exitX }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] as const }}
          className="absolute inset-0 bg-[#3E2723]"
        />

        {/* Panel 2: Xanh Rừng */}
        <motion.div
          initial={{ x: initialX }}
          animate={{ x: exitX }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] as const, delay: 0.06 }}
          className="absolute inset-0 bg-[#4A5D23]"
        />

        {/* Panel 3: Đất Nung Bazan kèm Logo */}
        <motion.div
          initial={{ x: initialX }}
          animate={{ x: exitX }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] as const, delay: 0.12 }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 bg-[#CC7755] flex flex-col items-center justify-center text-[#FDFBF7]"
        >
          <div className="flex flex-col items-center text-center px-6">
            <div className="w-12 h-12 rounded-full border border-amber-200/50 bg-black/20 flex items-center justify-center text-amber-200 mb-2 shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#FDFBF7] uppercase">
              Cẩm Cù House
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-amber-100 uppercase mt-0.5">
              {isNext ? "Đang Chuyển Trang Tiếp Theo →" : "← Đang Quay Lại Trang Trước"}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Chế độ 2: Stagger Panels 3 lớp màu nối tiếp (#3E2723 → #4A5D23 → #CC7755)
  if (mode === "stagger-panels") {
    return (
      <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden">
        {/* Lớp 1: Nâu Robusta (#3E2723) */}
        <motion.div
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.04 }}
          className="absolute inset-0 bg-[#3E2723] z-10"
        />

        {/* Lớp 2: Xanh Rừng Cao Nguyên (#4A5D23) */}
        <motion.div
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.11 }}
          className="absolute inset-0 bg-[#4A5D23] z-20"
        />

        {/* Lớp 3: Đất Nung Đỏ Bazan (#CC7755) kèm Huy hiệu Logo Cẩm Cù House */}
        <motion.div
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.18 }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 bg-[#CC7755] z-30 flex flex-col items-center justify-center text-[#FDFBF7] shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-center text-center px-6"
          >
            <div className="w-12 h-12 rounded-full border border-amber-200/50 bg-black/20 flex items-center justify-center text-amber-200 mb-3 shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#FDFBF7] uppercase drop-shadow-md">
              Cẩm Cù House
            </h2>

            <p className="text-[10px] sm:text-xs font-sans tracking-[0.25em] text-amber-100 uppercase mt-1">
              coffee & food • Gia Nghĩa
            </p>

            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-200/60 to-transparent mt-3" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Chế độ 1 mặc định: Màn che trượt đơn sắc Nâu Robusta (#3E2723) kèm Logo
  return (
    <motion.div
      key="page-curtain-single"
      initial={{ y: "0%" }}
      animate={{ y: "-100%" }}
      transition={{
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1] as const,
        delay: 0.08,
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[#3E2723] text-[#FDFBF7] shadow-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(93,64,55,0.4)_0%,rgba(62,39,35,0.95)_100%)] opacity-80" />

      {/* Vòng tròn Circle Reveal nở bung nếu có click */}
      {clickCoords && (
        <motion.div
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 25, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: clickCoords.x,
            top: clickCoords.y,
            width: 20,
            height: 20,
            borderRadius: "9999px",
            backgroundColor: "#FDFBF7",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

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

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransitionContext } from "@/context/TransitionContext";

interface PageTransitionCurtainProps {
  onComplete?: () => void;
}

export default function PageTransitionCurtain({ onComplete }: PageTransitionCurtainProps) {
  const { mode, direction, clickCoords } = useTransitionContext();
  const pathname = usePathname();

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

  // Chế độ 1 mặc định: Màn che xanh rêu trượt lên (#2D4233) + Tên trang hiện giữa màn hình
  const getPageTitle = (path: string) => {
    if (!path || path === "/") return "TRANG CHỦ";
    if (path.startsWith("/about")) return "CÂU CHUYỆN";
    if (path.startsWith("/space")) return "KHÔNG GIAN SUỐI";
    if (path.startsWith("/menu")) return "THỰC ĐƠN";
    if (path.startsWith("/contact")) return "CHỈ ĐƯỜNG & LIÊN HỆ";
    if (path.startsWith("/admin")) return "QUẢN TRỊ VIÊN";
    return "CẨM CÙ HOUSE";
  };

  const currentTitle = getPageTitle(pathname || "");

  return (
    <motion.div
      key="page-curtain-moss-green"
      initial={{ y: "0%" }}
      animate={{ y: "-100%" }}
      transition={{
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1] as const,
        delay: 0.08,
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[#2D4233] text-[#FDFBF7] shadow-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(62,92,70,0.5)_0%,rgba(32,49,37,0.98)_100%)] opacity-90" />

      {/* 2. Circle reveal mở từ vị trí click menu */}
      {clickCoords && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 30, opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: clickCoords.x,
            top: clickCoords.y,
            width: 24,
            height: 24,
            borderRadius: "9999px",
            backgroundColor: "#FDFBF7",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* 1. Màn che xanh rêu trượt lên + tên trang hiện giữa màn hình */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.45, delay: 0.22 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <div className="w-12 h-12 rounded-full border border-emerald-300/40 bg-emerald-950/50 flex items-center justify-center text-emerald-200 mb-3 shadow-lg shadow-black/40">
          <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
        </div>

        {/* Tên trang hiện giữa màn hình */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest text-[#FDFBF7] uppercase drop-shadow-md">
          {currentTitle}
        </h2>

        <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] text-emerald-200/90 uppercase mt-2 font-medium">
          CẨM CÙ HOUSE • GIA NGHĨA
        </p>

        <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent mt-3.5" />
      </motion.div>
    </motion.div>
  );
}

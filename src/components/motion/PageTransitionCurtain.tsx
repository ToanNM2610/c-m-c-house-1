"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import StarHoya from "@/components/ui/StarHoya";

interface PageTransitionCurtainProps {
  onComplete?: () => void;
}

export default function PageTransitionCurtain({ onComplete }: PageTransitionCurtainProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Xác định tên trang mục tiêu
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

  // Dự phòng cross-fade 0.3s khi bật reduced-motion
  if (shouldReduceMotion) {
    return (
      <motion.div
        key={`reduced-transition-${pathname}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 z-[99999] pointer-events-none bg-[var(--paper)]"
      />
    );
  }

  return (
    <motion.div
      key={`page-arch-curtain-${pathname}`}
      initial={{ y: "100%", borderRadius: "999px 999px 0 0" }}
      animate={{
        y: ["100%", "0%", "-100%"],
        borderRadius: ["999px 999px 0 0", "0px 0px 0 0", "0 0 999px 999px"],
      }}
      transition={{
        duration: 1.05,
        times: [0, 0.45, 1],
        ease: [0.65, 0, 0.35, 1],
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[var(--basalt)] text-white shadow-2xl overflow-hidden"
    >
      {/* Tên trang Fraunces 64px + Tọa độ Mono */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.9, 1, 1, 0.95],
          y: [30, 0, 0, -30],
        }}
        transition={{
          duration: 1.05,
          times: [0, 0.35, 0.65, 1],
          ease: "easeInOut",
        }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Star Hoya Icon */}
        <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 flex items-center justify-center mb-5 backdrop-blur-sm">
          <StarHoya size={24} className="text-white" strokeWidth={1.5} />
        </div>

        {/* Tọa độ mono */}
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/80 mb-2">
          11.99° N · 107.69° E · ĐỘ CAO 800M+
        </span>

        {/* Tên trang Fraunces 64px */}
        <h2 className="font-serif text-[clamp(36px,6vw,64px)] font-bold tracking-tight text-white leading-tight uppercase">
          {currentTitle}
        </h2>

        {/* Slogan */}
        <p className="font-serif italic text-[16px] sm:text-[18px] text-white/90 mt-2">
          Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
        </p>

        <div className="w-20 h-[1.5px] bg-white/40 mt-4" />
      </motion.div>
    </motion.div>
  );
}

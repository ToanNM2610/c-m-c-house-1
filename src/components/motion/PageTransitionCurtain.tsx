"use client";

import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { usePathname } from "next/navigation";
interface PageTransitionCurtainProps {
  onComplete?: () => void;
}

export default function PageTransitionCurtain({ onComplete }: PageTransitionCurtainProps) {
  const pathname = usePathname();

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

  return (
    <motion.div
      key={`page-curtain-${pathname}`}
      initial={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
      animate={{ clipPath: "circle(0% at 50% 50%)", opacity: 1 }}
      transition={{
        duration: 0.75,
        ease: [0.2, 0.7, 0.2, 1] as const,
        delay: 0.2,
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[#183A28] text-[#F3EBD8] shadow-2xl overflow-hidden"
    >



      {/* Huy hiệu & Tên trang hiện giữa màn hình */}
      <motion.div
        initial={{ opacity: 1, scale: 1, y: 0 }}
        animate={{ opacity: 0, scale: 0.95, y: -15 }}
        transition={{ duration: 0.35, delay: 0.18 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Logo nhỏ phía trên */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-300/40 bg-emerald-950/60 shadow-lg mb-4">
          <Flower2 className="w-4 h-4 text-emerald-300 animate-pulse" />
          <span className="font-serif text-xs font-bold tracking-widest text-emerald-200 uppercase">
            CẨM CÙ HOUSE
          </span>
        </div>

        {/* Tên trang chữ lớn điện ảnh >= 40px màu kem sáng */}
        <h2 className="font-serif text-[40px] sm:text-5xl lg:text-6xl font-bold tracking-wider sm:tracking-widest text-[#F3EBD8] uppercase drop-shadow-lg leading-tight">
          {currentTitle}
        </h2>

        <p className="text-[13px] sm:text-[14px] font-sans tracking-[0.2em] text-[#F3EBD8]/95 uppercase mt-3 font-semibold">
          Chốn Dừng Chân Bên Suối Đá, Gia Nghĩa
        </p>

        <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent mt-4" />
      </motion.div>
    </motion.div>
  );
}

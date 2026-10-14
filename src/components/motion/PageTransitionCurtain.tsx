"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionCurtainProps {
  onComplete?: () => void;
}

const COLUMNS = [
  { id: 0, color: "bg-[#123A2B]" }, // pine
  { id: 1, color: "bg-[var(--ember)]" }, // ember
  { id: 2, color: "bg-[#0A0E0C]" }, // bg
  { id: 3, color: "bg-[#123A2B]" }, // pine
  { id: 4, color: "bg-[#101714]" }, // bg-2
];

export default function PageTransitionCurtain({ onComplete }: PageTransitionCurtainProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Xác định số thứ tự và tên trang
  const getPageInfo = (path: string) => {
    if (!path || path === "/") return { num: "[01]", title: "TRANG CHỦ" };
    if (path.startsWith("/about")) return { num: "[02]", title: "CÂU CHUYỆN" };
    if (path.startsWith("/space")) return { num: "[03]", title: "KHÔNG GIAN SUỐI" };
    if (path.startsWith("/menu")) return { num: "[04]", title: "THỰC ĐƠN" };
    if (path.startsWith("/contact")) return { num: "[05]", title: "CHỈ ĐƯỜNG & LIÊN HỆ" };
    if (path.startsWith("/admin")) return { num: "[AD]", title: "QUẢN TRỊ VIÊN" };
    return { num: "[00]", title: "CẨM CÙ HOUSE" };
  };

  const { num, title } = getPageInfo(pathname || "");

  // Dự phòng cross-fade 0.3s khi bật reduced-motion (Section 9 & 10)
  if (shouldReduceMotion) {
    return (
      <motion.div
        key={`reduced-transition-${pathname}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 z-[99998] pointer-events-none bg-[var(--bg)]"
      />
    );
  }

  return (
    <div
      key={`curtain-wrapper-${pathname}`}
      className="fixed inset-0 z-[99998] pointer-events-none overflow-hidden select-none"
    >
      {/* 5 Cột dọc (pine / ember / bg) quét lên theo thứ tự (stagger .06s) - Section 9 */}
      <div className="absolute inset-0 flex w-full h-full">
        {COLUMNS.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ y: "100%" }}
            animate={{
              y: ["100%", "0%", "-100%"],
            }}
            transition={{
              duration: 0.82,
              times: [0, 0.42, 1],
              delay: index * 0.06,
              ease: [0.77, 0, 0.175, 1],
            }}
            onAnimationComplete={index === COLUMNS.length - 1 ? onComplete : undefined}
            className={`w-1/5 h-full ${col.color} border-r border-white/5 last:border-r-0`}
          />
        ))}
      </div>

      {/* Trung tâm: Số trang + Tên trang Display (Section 9) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.95, 1, 1, 0.98],
          y: [20, 0, 0, -20],
        }}
        transition={{
          duration: 0.88,
          times: [0, 0.35, 0.65, 1],
          ease: "easeInOut",
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
      >
        <span className="font-mono text-[13px] tracking-widest text-[var(--ember)] font-bold mb-2">
          {num} · 11.99° N · 107.69° E
        </span>

        <h2 className="font-display font-black text-[clamp(32px,6vw,72px)] tracking-tight text-[#F2EDE4] uppercase leading-none">
          {title}
        </h2>

        <p className="font-serif italic text-[16px] text-[#F2EDE4]/70 mt-2">
          Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
        </p>
      </motion.div>
    </div>
  );
}

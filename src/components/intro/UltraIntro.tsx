"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "camcu_intro_played";

/**
 * UltraIntro — Poetic Minimalist Coffee Experience
 *
 * Sequence:
 * Giai đoạn 1: Màn tối nâu cà phê trầm → Logo CẨM CÙ HOUSE xuất hiện tĩnh lặng, sang trọng.
 * Giai đoạn 2: Tagline "Một góc bình yên giữa lòng Gia Nghĩa" hé mở êm ái.
 * Giai đoạn 3: Ánh sáng tự nhiên mở lớp, hé lộ không gian Hero Trang Chủ phía sau.
 * Giai đoạn 4: Lướt nhẹ vào Trang Chủ, mở khóa cuộn trang.
 *
 * Thời lượng: ~2.6s trên Desktop, tự động tối ưu ~1.8s trên Mobile (<768px).
 * Phiên duyệt web: Lưu sessionStorage, chỉ hiển thị duy nhất 1 lần đầu.
 */
export default function UltraIntro() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const handleSkip = useCallback(() => {
    setIsSkipping(true);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      setIsPlaying(false);
    }, 200);
  }, []);

  useEffect(() => {
    setMounted(true);

    // Kiểm tra phiên duyệt web: chỉ chạy 1 lần duy nhất trong sessionStorage
    try {
      const hasPlayed = sessionStorage.getItem(STORAGE_KEY);
      if (hasPlayed === "true") {
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Dự phòng trường hợp trình duyệt chặn sessionStorage (private browsing)
    }

    const mobile = window.innerWidth < 768;
    setIsMobileDevice(mobile);
    setIsPlaying(true);
    document.body.style.overflow = "hidden";

    // Desktop: ~2.6s tổng | Mobile: ~1.8s (rút ngắn ~35%)
    const tScale = mobile ? 0.69 : 1.0;

    const tStage2 = setTimeout(() => setStage(2), Math.round(800 * tScale));
    const tStage3 = setTimeout(() => setStage(3), Math.round(1600 * tScale));
    const tStage4 = setTimeout(() => setStage(4), Math.round(2200 * tScale));
    const tEnd    = setTimeout(() => {
      document.body.style.overflow = "auto";
      setIsPlaying(false);
    }, Math.round(2600 * tScale));

    return () => {
      clearTimeout(tStage2);
      clearTimeout(tStage3);
      clearTimeout(tStage4);
      clearTimeout(tEnd);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Không hiển thị nếu chưa mount (tránh hydration mismatch) hoặc đã xem trong phiên này
  if (!mounted || !isPlaying) return null;

  const animDuration = isMobileDevice ? 0.4 : 0.6;

  return (
    <AnimatePresence>
      <motion.div
        key="poetic-intro-overlay"
        initial={{ opacity: 1, scale: 1 }}
        animate={
          isSkipping
            ? { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }
            : stage === 4
            ? { opacity: 0, scale: 1.03, transition: { duration: animDuration, ease: [0.22, 1, 0.36, 1] } }
            : { opacity: 1, scale: 1 }
        }
        exit={{ opacity: 0, scale: 1.03 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden select-none"
      >
        {/* ═══ NỀN NÂU CÀ PHÊ TRẦM SÂU THẲM & ÁNH SÁNG TỰ NHIÊN HÉ MỞ ═══ */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: stage >= 3 ? 0.28 : 1,
            transition: { duration: animDuration * 1.2, ease: "easeInOut" },
          }}
          className="absolute inset-0 z-0 bg-[#0c0a08]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, #1a1410 0%, #0e0c09 60%, #070605 100%)",
          }}
        />

        {/* ═══ VẦNG SÁNG HỔ PHÁCH TỰ NHIÊN (NẮNG SỚM QUA TÁN CÂY) ═══ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: stage >= 2 ? (stage >= 3 ? 0.5 : 0.25) : 0.1,
            scale: stage >= 3 ? 1.15 : 1,
            transition: { duration: animDuration * 1.5, ease: "easeOut" },
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[650px] max-h-[650px] rounded-full bg-[#C88A4B]/15 blur-[120px] pointer-events-none z-10"
        />

        {/* ═══ NÚT BỎ QUA (SKIP BUTTON) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-50 pointer-events-auto"
        >
          <button
            onClick={handleSkip}
            type="button"
            className="group flex items-center gap-1.5 text-xs font-sans tracking-[0.25em] uppercase text-white/45 hover:text-white/95 transition-colors duration-300 py-2 px-3 cursor-pointer"
            aria-label="Bỏ qua phần giới thiệu"
          >
            <span>BỎ QUA</span>
            <span className="text-[#C88A4B] transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </motion.div>

        {/* ═══ KHUNG NỘI DUNG CHÍNH: LOGO & TAGLINE ═══ */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-2xl">
          {/* GIAI ĐOẠN 1: LOGO CẨM CÙ HOUSE */}
          <motion.div
            initial={{ opacity: 0, y: 12, letterSpacing: "0.16em" }}
            animate={{
              opacity: stage >= 3 ? 0.4 : 1,
              y: 0,
              letterSpacing: "0.22em",
              transition: { duration: animDuration * 1.3, ease: [0.16, 1, 0.3, 1] },
            }}
            className="mb-3"
          >
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light text-[#F5EFEB] drop-shadow-[0_2px_24px_rgba(200,138,75,0.22)]">
              CẨM CÙ HOUSE
            </h1>
          </motion.div>

          {/* GIAI ĐOẠN 2: TAGLINE HÉ MỞ */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={
              stage >= 2
                ? {
                    opacity: stage >= 3 ? 0.4 : 1,
                    y: 0,
                    transition: { duration: animDuration, ease: [0.22, 1, 0.36, 1] },
                  }
                : { opacity: 0, y: 8 }
            }
            className="flex flex-col items-center gap-1.5"
          >
            <p className="font-sans text-xs sm:text-sm md:text-base font-light tracking-[0.18em] text-[#C88A4B]/90">
              Một góc bình yên giữa lòng Gia Nghĩa
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: stage >= 3 ? 0.3 : 0.6 } : { opacity: 0 }}
              transition={{ delay: 0.15, duration: animDuration }}
              className="flex items-center gap-2 text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-[#F5EFEB]/50 mt-1"
            >
              <span>Coffee</span>
              <span className="w-1 h-1 rounded-full bg-[#C88A4B]/50" />
              <span>Food</span>
              <span className="w-1 h-1 rounded-full bg-[#C88A4B]/50" />
              <span>Nature</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

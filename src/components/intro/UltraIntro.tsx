"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * UltraIntro — 7-Step Poetic Nature Cinematic Intro
 *
 * 1. MÀN HÌNH MỞ ĐẦU (0.0s - 0.7s): Nền nâu cà phê #0a0705, film grain, ambient glow thở nhẹ.
 * 2. LOGO XUẤT HIỆN (0.7s - 1.5s): Chữ CẨM CÙ HOUSE fade-in scale 96%->100%, amber glow, shimmer sweep.
 * 3. TAGLINE HÉ LỘ (1.5s - 2.2s): "Một góc bình yên giữa lòng Gia Nghĩa", tracking mở rộng, không nảy.
 * 4. HIỆU ỨNG THIÊN NHIÊN ĐẠI NGÀN (2.0s - 2.8s): Bóng lay tán lá, vệt nắng sớm, 25-30 đốm bụi sáng lơ lửng.
 * 5. CINEMATIC REVEAL VÀO HERO (2.8s - 3.4s): Horizontal light sweep, scale 1.0->1.03, blur 8px->0px, opacity->0.
 * 6. HEADER ĐỒNG BỘ XUẤT HIỆN (3.4s - 4.0s): Dispatch event camcu_intro_reveal cho Navbar xuất hiện.
 * 7. NÚT BỎ QUA & CƠ CHẾ RELOAD: Bỏ qua trong 0.2s, kích hoạt đầy đủ mỗi khi Reload (F5).
 */

interface DustMote {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  xDrift: number;
  yDrift: number;
  opacity: number;
}

export default function UltraIntro() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // Sinh trước 28 đốm bụi sáng hữu cơ (organic dust motes) nhẹ nhàng
  const dustMotes = useMemo<DustMote[]>(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      size: 1.5 + Math.random() * 2.5,
      duration: 3.5 + Math.random() * 2.5,
      delay: Math.random() * 0.8,
      xDrift: (Math.random() - 0.5) * 24,
      yDrift: -20 - Math.random() * 30,
      opacity: 0.25 + Math.random() * 0.35,
    }));
  }, []);

  const completeIntro = useCallback(() => {
    document.body.style.overflow = "auto";
    if (typeof window !== "undefined") {
      (window as unknown as { __CAMCU_INTRO_REVEALED__?: boolean }).__CAMCU_INTRO_REVEALED__ = true;
      window.dispatchEvent(new CustomEvent("camcu_intro_reveal"));
    }
    setIsPlaying(false);
  }, []);

  const handleSkip = useCallback(() => {
    setIsSkipping(true);
    document.body.style.overflow = "auto";
    if (typeof window !== "undefined") {
      (window as unknown as { __CAMCU_INTRO_REVEALED__?: boolean }).__CAMCU_INTRO_REVEALED__ = true;
      window.dispatchEvent(new CustomEvent("camcu_intro_reveal"));
    }
    setTimeout(() => {
      setIsPlaying(false);
    }, 200);
  }, []);

  useEffect(() => {
    setMounted(true);
    // Luôn khóa cuộn trang khi bắt đầu intro (mỗi lần reload F5)
    document.body.style.overflow = "hidden";

    // 2.8s: Bắt đầu giai đoạn 5 - Cinematic Reveal vào Hero
    const tReveal = setTimeout(() => {
      setIsRevealing(true);
    }, 2800);

    // 3.4s: Giai đoạn 6 - Hero lộ diện hoàn toàn, kích hoạt Header đồng bộ
    const tEnd = setTimeout(() => {
      completeIntro();
    }, 3400);

    return () => {
      clearTimeout(tReveal);
      clearTimeout(tEnd);
      document.body.style.overflow = "auto";
    };
  }, [completeIntro]);

  if (!mounted || !isPlaying) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="poetic-nature-intro"
        initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        animate={
          isSkipping
            ? { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }
            : isRevealing
            ? {
                opacity: 0,
                scale: 1.03,
                filter: "blur(8px)",
                transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
              }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden select-none"
      >
        {/* ═══ 1. MÀN HÌNH MỞ ĐẦU: NỀN NÂU CÀ PHÊ HỮU CƠ & FILM GRAIN ═══ */}
        <div className="absolute inset-0 z-0 bg-[#0a0705]" />

        {/* Lớp Film Grain / Noise siêu nhẹ (opacity-[0.035]) xóa bỏ cảm giác số thô cứng */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Quầng sáng ấm mờ (radial ambient glow #c88a4b với blur-3xl) thở nhẹ và trôi chậm */}
        <motion.div
          animate={{
            scale: [1, 1.14, 1],
            opacity: [0.18, 0.32, 0.18],
            x: ["-50%", "-48%", "-52%", "-50%"],
            y: ["-50%", "-52%", "-49%", "-50%"],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-[75vw] h-[75vw] max-w-[650px] max-h-[650px] rounded-full bg-[#c88a4b]/20 blur-[130px] pointer-events-none z-10"
        />

        {/* ═══ 4. HIỆU ỨNG THIÊN NHIÊN ĐẠI NGÀN (2.0s - 2.8s) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none z-15 overflow-hidden"
        >
          {/* Bóng lay nhẹ của tán lá cây (dappled foliage shadow mask) như gió rừng Đắk Nông */}
          <motion.div
            animate={{
              rotate: [-1.5, 1.5, -1.5],
              x: [-8, 8, -8],
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 6.0,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-12 -left-12 w-[120vw] h-[120vh] opacity-[0.08] pointer-events-none blur-[24px]"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(200, 138, 75, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(45, 74, 62, 0.8) 0%, transparent 60%)",
            }}
          />

          {/* Vệt nắng sớm (soft god rays) xiên nhẹ qua tán lá */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.08, 0.16, 0.08] }}
            transition={{
              delay: 2.1,
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-[20%] left-[10%] w-[60vw] h-[140vh] -rotate-25 pointer-events-none blur-[40px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(200, 138, 75, 0.18) 0%, rgba(255, 244, 208, 0.06) 40%, transparent 80%)",
            }}
          />

          {/* 20-30 đốm bụi sáng li ti (organic dust motes) lơ lửng theo sóng sin */}
          {dustMotes.map((mote) => (
            <motion.div
              key={mote.id}
              initial={{
                x: `${mote.x}vw`,
                y: `${mote.y}vh`,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: [0, mote.opacity, 0],
                x: [`${mote.x}vw`, `${mote.x + mote.xDrift / 15}vw`, `${mote.x}vw`],
                y: [`${mote.y}vh`, `${mote.y + mote.yDrift / 15}vh`],
              }}
              transition={{
                delay: 2.0 + mote.delay,
                duration: mote.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full bg-[#FFE0A3] shadow-[0_0_6px_rgba(200,138,75,0.7)] pointer-events-none"
              style={{
                width: `${mote.size}px`,
                height: `${mote.size}px`,
              }}
            />
          ))}
        </motion.div>

        {/* ═══ 5. HORIZONTAL LIGHT SWEEP CHUYỂN CẢNH (2.8s - 3.4s) ═══ */}
        <motion.div
          initial={{ x: "-120vw", opacity: 0 }}
          animate={
            isRevealing
              ? { x: "120vw", opacity: [0, 0.65, 0] }
              : { x: "-120vw", opacity: 0 }
          }
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-[50vw] h-full bg-gradient-to-r from-transparent via-[#FFF4D0]/30 to-transparent -skew-x-20 pointer-events-none z-30 mix-blend-overlay"
        />

        {/* ═══ 7. NÚT BỎ QUA THANH LỊCH (SKIP BUTTON) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-50 pointer-events-auto"
        >
          <button
            onClick={handleSkip}
            type="button"
            className="group flex items-center gap-1.5 text-xs font-sans tracking-[0.25em] uppercase text-white/50 hover:text-white transition-opacity duration-300 py-2 px-3 cursor-pointer"
            aria-label="Bỏ qua phần giới thiệu"
          >
            <span>BỎ QUA</span>
            <span className="text-[#C88A4B] transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </motion.div>

        {/* ═══ TRUNG TÂM: 2. LOGO XUẤT HIỆN & 3. TAGLINE HÉ LỘ ═══ */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-3xl">
          {/* 2. LOGO CẨM CÙ HOUSE (0.7s - 1.5s) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.7,
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
              },
            }}
            className="relative overflow-hidden px-4 py-2"
          >
            {/* Shimmer light sweep quét chéo ngang bề mặt logo từ trái sang phải */}
            <motion.div
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "220%", opacity: [0, 0.9, 0] }}
              transition={{
                delay: 0.95,
                duration: 0.75,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#FFF4D0]/70 to-transparent -skew-x-25 pointer-events-none mix-blend-overlay z-10"
            />

            {/* Chữ logo CẨM CÙ HOUSE với warm amber drop-shadow glow nở ra rồi dịu nhẹ */}
            <motion.h1
              initial={{
                filter: "drop-shadow(0 0 40px rgba(200, 138, 75, 0.6))",
              }}
              animate={{
                filter: "drop-shadow(0 2px 20px rgba(200, 138, 75, 0.25))",
              }}
              transition={{
                delay: 0.85,
                duration: 0.9,
                ease: "easeOut",
              }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] text-[#F5EFEB]"
            >
              CẨM CÙ HOUSE
            </motion.h1>
          </motion.div>

          {/* 3. TAGLINE HÉ LỘ (1.5s - 2.2s): Tĩnh lặng, không spring bounce */}
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              letterSpacing: "0.02em",
            }}
            animate={{
              opacity: 1,
              y: 0,
              letterSpacing: "0.15em",
            }}
            transition={{
              delay: 1.5,
              duration: 0.7,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="mt-2 flex flex-col items-center gap-1.5"
          >
            <p className="font-sans text-xs sm:text-sm md:text-base font-light text-[#C88A4B]/90">
              Một góc bình yên giữa lòng Gia Nghĩa
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.8, duration: 0.5 }}
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

'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const INTRO_STORAGE_KEY = 'camcu_intro_seen_v1';

export default function IntroSplashScreen() {
  const [show, setShow] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);

    // Kiểm tra xem người dùng đã từng xem hoặc bấm bỏ qua chưa
    const hasSeenIntro = localStorage.getItem(INTRO_STORAGE_KEY);
    if (hasSeenIntro === 'true') {
      return;
    }

    setShow(true);
    // Khóa cuộn tuyệt đối trên cả body và html
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Chạy bộ đếm 0 -> 100% trong 1.5 giây
    const startTime = performance.now();
    const duration = 1500; // 1.5 giây

    let animId: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const current = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(current);

      if (current < 100) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        // Đạt 100%: Màn che tách đôi dứt khoát mở ra trang chủ
        setIsSplitting(true);
        localStorage.setItem(INTRO_STORAGE_KEY, 'true');
        setTimeout(() => {
          setShow(false);
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }, 550);
      }
    };

    animId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animId);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSkip = () => {
    // Lưu lựa chọn để không bao giờ chạy lại ở các lần truy cập sau
    localStorage.setItem(INTRO_STORAGE_KEY, 'true');
    setIsSplitting(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, 280);
  };

  if (!show) return null;

  const content = (
    <div className="fixed inset-0 z-[9999999] pointer-events-auto flex items-center justify-center overflow-hidden bg-[#121A15] select-none">
      {/* Nút Bỏ qua to, rõ, dễ bấm */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-black/50 hover:bg-black/75 border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xl"
      >
        <span>Bỏ qua / Skip</span>
        <span className="text-emerald-300 font-bold">✕</span>
      </button>

      {/* MÀN CHE TÁCH ĐÔI TRÁI & PHẢI (Che kín 100% không để lộ trang chủ trước khi mở) */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isSplitting ? '-100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] as const }}
        className="absolute top-0 left-0 w-[50.5vw] h-full bg-[#121A15] border-r border-emerald-950/60 shadow-2xl z-20 pointer-events-none"
      />
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isSplitting ? '100%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] as const }}
        className="absolute top-0 right-0 w-[50.5vw] h-full bg-[#121A15] border-l border-emerald-950/60 shadow-2xl z-20 pointer-events-none"
      />

      {/* 1. DÒNG SUỐI CHẢY DỌC MÀN HÌNH */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-start z-20">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isSplitting ? 0 : '46vh', opacity: isSplitting ? 0 : [0, 0.9, 1] }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-[2px] bg-gradient-to-b from-transparent via-teal-400 to-emerald-300 shadow-[0_0_12px_#34d399]"
        />
      </div>

      {/* KHỐI NỘI DUNG CHÍNH (NẰM TRÊN MÀN CHE) */}
      <motion.div
        animate={{ opacity: isSplitting ? 0 : 1, scale: isSplitting ? 0.94 : 1 }}
        transition={{ duration: 0.35 }}
        className="relative z-30 flex flex-col items-center text-center px-6 max-w-lg"
      >
        {/* 2. GIỌT NƯỚC RƠI & LAN TỎA VÒNG TRÒN (WATER DROPLET & RIPPLE) */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-2">
          {/* Giọt nước rơi từ trên xuống */}
          <motion.div
            initial={{ y: -45, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
            className="w-3.5 h-3.5 rounded-full bg-teal-200 shadow-[0_0_16px_#2dd4bf] z-10"
          />

          {/* Các vòng sóng tròn lan tỏa (Water Ripples) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.2, 4], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
            className="absolute w-12 h-12 rounded-full border border-teal-400/60 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.2, 4], opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
            className="absolute w-12 h-12 rounded-full border border-emerald-500/40 pointer-events-none"
          />

          {/* 3. HOA CẨM CÙ (HOYA) NỞ NÉT VẼ QUANH LOGO */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <motion.path
                key={i}
                d="M50 50 Q45 20, 50 15 Q55 20, 50 50"
                transform={`rotate(${angle} 50 50)`}
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.06, ease: 'easeInOut' }}
              />
            ))}
          </svg>
        </div>

        {/* 5. KHÓI CÀ PHÊ BỐC LÊN (COFFEE STEAM WISPS) */}
        <div className="relative flex justify-center w-full mb-1">
          <svg className="w-20 h-7 overflow-visible opacity-60" viewBox="0 0 80 30">
            <motion.path
              d="M30 25 Q35 15, 32 8 Q29 0, 36 -10"
              fill="none"
              stroke="#e6d5bc"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0, y: 10, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], y: [-5, -18, -30], opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
            />
            <motion.path
              d="M45 25 Q40 15, 46 8 Q50 0, 44 -10"
              fill="none"
              stroke="#e6d5bc"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0, y: 10, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], y: [-5, -18, -30], opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </svg>
        </div>

        {/* TIÊU ĐỀ THƯƠNG HIỆU */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#F9F8F3] drop-shadow-md mb-2"
        >
          CẨM CÙ HOUSE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="text-xs sm:text-sm font-sans text-stone-300 font-light tracking-[0.25em] uppercase mb-4"
        >
          Chốn Dừng Chân Bên Suối Đá Gia Nghĩa
        </motion.p>

        {/* 4. ĐẾM 0 → 100% KÈM TỌA ĐỘ CHẠY SỐ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-xs flex flex-col items-center gap-1.5"
        >
          <div className="w-full h-[2px] bg-stone-800/80 rounded-full overflow-hidden">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300"
            />
          </div>

          <div className="flex items-center justify-between w-full text-[11px] text-stone-400 font-mono tracking-wider pt-0.5">
            <span>11.99° N, 107.69° E</span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  return mounted && typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : content;
}

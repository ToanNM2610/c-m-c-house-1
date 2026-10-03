'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

declare global {
  interface Window {
    __camcu_intro_played?: boolean;
  }
}

export default function IntroSplashScreen() {
  const [show, setShow] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Chỉ chạy ở môi trường client
    if (typeof window === 'undefined') return;
    setMounted(true);

    // Kích hoạt khi tải lại trang (F5) hoặc lần đầu mở tab
    if (!window.__camcu_intro_played) {
      window.__camcu_intro_played = true;
      setShow(true);
      document.body.style.overflow = 'hidden';

      // Bắt đầu fade out sau 1.8s
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 1800);

      // Tắt hoàn toàn sau 2.4s
      const hideTimer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = '';
      }, 2400);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
        document.body.style.overflow = '';
      };
    }
  }, []);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, 300);
  };

  if (!show) return null;

  const content = (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#121A15] text-[#F9F8F3] px-6 transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Nút Bỏ qua */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 text-xs text-stone-400 hover:text-white px-3.5 py-1.5 rounded-full border border-stone-700/60 bg-stone-900/50 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
      >
        Bỏ qua / Skip ✕
      </button>

      {/* Biểu tượng và Hiệu ứng */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-md animate-fade-in">
        <div className="w-14 h-14 rounded-full border border-emerald-500/30 bg-emerald-950/40 flex items-center justify-center text-emerald-400 text-2xl shadow-lg shadow-emerald-950/60 animate-pulse">
          🌿
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-[#F9F8F3] drop-shadow-md">
          CẨM CÙ HOUSE
        </h1>

        <p className="text-xs sm:text-sm font-sans text-stone-300 font-light tracking-widest uppercase">
          Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
        </p>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent mt-2"></div>

        <span className="text-[11px] text-stone-400 tracking-wider">
          GIA NGHĨA • ĐẮK NÔNG
        </span>
      </div>
    </div>
  );

  return mounted && typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : content;
}

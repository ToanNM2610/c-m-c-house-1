"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Waves } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "camcu_intro_seen";

export default function IntroSplashScreen() {
  const { locale, dict } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0: icon appears, 1: brand & slogan reveal, 2: exiting
  const [hidden, setHidden] = useState(true);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Only run on client-side
    setMounted(true);
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (seen === "true") {
        setHidden(true);
        return;
      }
    } catch {
      // In private browsing or restricted environments, fallback gracefully
    }

    // Start cinematic intro
    setHidden(false);
    document.body.classList.add("overflow-hidden");

    // Timeline:
    // 0.0s - 0.6s: Stage 0 (icon ripples in)
    // 0.6s - 1.5s: Stage 1 (Brand title glows, expanding bronze line, slogan reveals)
    const t1 = setTimeout(() => {
      setStage(1);
    }, 600);

    // 1.5s - 2.2s: Stage 2 (Curtain opens / gentle fade out)
    const t2 = setTimeout(() => {
      setStage(2);
    }, 1550);

    // 2.25s: Complete intro, unlock scroll, persist seen flag
    const t3 = setTimeout(() => {
      finishIntro();
    }, 2250);

    timeoutsRef.current = [t1, t2, t3];

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const finishIntro = () => {
    timeoutsRef.current.forEach(clearTimeout);
    setStage(2);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    document.body.classList.remove("overflow-hidden");
    setTimeout(() => {
      setHidden(true);
    }, 650);
  };

  if (!mounted || hidden) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome to Cam Cu House"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#121A15] text-[#F5F4EE] px-4 select-none transform-gpu transition-all duration-700 ease-out ${
        stage === 2 ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-radial from-[#3E5C46]/25 via-[#1E2B22]/10 to-transparent blur-3xl pointer-events-none transform -translate-y-6" />

      {/* Skip Button (Top Right) */}
      <button
        type="button"
        onClick={finishIntro}
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20 px-3.5 py-1.5 rounded-full text-xs font-medium text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
        aria-label={dict.introSplash.skip}
      >
        <span>{dict.introSplash.skip}</span>
      </button>

      {/* Center Cinematic Content */}
      <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto text-center">
        {/* 1. Leaf / Stream Icon (0.0s - 0.6s) */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E2B22] border border-[#3E5C46]/40 flex items-center justify-center text-[#88B795] shadow-[0_0_30px_rgba(62,92,70,0.35)] transition-all duration-700 ease-out transform-gpu ${
            stage >= 0 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4"
          }`}
        >
          <div className="relative">
            <Waves className="w-7 h-7 sm:w-8 sm:h-8 text-[#88B795] animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
          </div>
        </div>

        {/* 2. Brand Title with Subtle Glow (0.6s - 1.4s) */}
        <div
          className={`mt-5 transition-all duration-700 ease-out transform-gpu ${
            stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#F5F4EE] drop-shadow-[0_2px_18px_rgba(136,183,149,0.35)]">
            CẨM CÙ HOUSE
          </h1>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#88B795] font-semibold mt-1">
            coffee &amp; Food • Gia Nghĩa
          </p>
        </div>

        {/* 3. Expanding Copper/Bronze Accent Line */}
        <div
          className={`h-[1.5px] bg-gradient-to-r from-transparent via-[#D1A684] to-transparent my-3.5 transition-all duration-700 ease-out transform-gpu ${
            stage >= 1 ? "w-36 sm:w-56 opacity-100" : "w-0 opacity-0"
          }`}
        />

        {/* 4. Poetic Slogan */}
        <p
          className={`text-xs sm:text-sm text-stone-300 font-normal tracking-wide max-w-md px-4 transition-all duration-700 delay-100 ease-out transform-gpu ${
            stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {locale === "en"
            ? "A Rustic Sanctuary by the Stream • Dak Nong"
            : "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá • Đắk Nông"}
        </p>
      </div>

      {/* Bottom Subtle Indicator */}
      <div
        className={`absolute bottom-8 flex items-center gap-1.5 text-[11px] text-stone-400 tracking-wider transition-opacity duration-500 ${
          stage === 1 ? "opacity-75" : "opacity-0"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>Tây Nguyên • 2026</span>
      </div>
    </div>
  );
}

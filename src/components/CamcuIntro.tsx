'use client';

import { useEffect, useRef, useState } from 'react';
import './camcu-intro.css';

const SHOW_ONCE = true;
const STORAGE_KEY = 'cc_intro';

export default function CamcuIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const exitingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = containerRef.current;
    if (!el) return;
    const dom = el;
    const root = document.documentElement;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const params = new URLSearchParams(window.location.search);
    const hasForceParam = params.has('intro') || params.has('replay');

    if (hasForceParam) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }

    const seen = (): boolean => {
      try {
        return (
          sessionStorage.getItem(STORAGE_KEY) === '1' ||
          sessionStorage.getItem('camcu_intro_seen') === '1'
        );
      } catch (_) {
        return false;
      }
    };

    const markSeen = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch (_) {}
    };

    // Đã xem hoặc prefers-reduced-motion -> bỏ qua intro ngay lập tức
    if ((SHOW_ONCE && seen() && !hasForceParam) || reduce) {
      dom.style.display = 'none';
      root.classList.remove('intro-lock');
      document.body.classList.add('intro-go');
      markSeen();
      document.dispatchEvent(new CustomEvent('camcu:intro-done'));
      setIsVisible(false);
      return;
    }

    // ── Khởi chạy Intro Đại Ngàn Điện Ảnh (≤ 3.5s) ──
    let cleanup = () => {};

    async function runIntro() {
      exitingRef.current = false;
      dom.style.display = '';
      root.classList.add('intro-lock');
      document.body.classList.remove('intro-go');

      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule;

      const skipBtn = dom.querySelector('#skip-btn') as HTMLElement | null;
      const elevationEl = dom.querySelector('#elevation-num') as HTMLElement | null;
      const progressLine = dom.querySelector('#elevation-progress') as HTMLElement | null;
      const centerContent = dom.querySelector('#intro-center') as HTMLElement | null;
      const emberLine = dom.querySelector('#intro-ember-line') as HTMLElement | null;
      const titleChars = dom.querySelectorAll('.intro-char');
      const leftHalf = dom.querySelector('#intro-half-left') as HTMLElement | null;
      const rightHalf = dom.querySelector('#intro-half-right') as HTMLElement | null;

      // Finish & Dispatch
      const finishIntro = () => {
        markSeen();
        dom.style.display = 'none';
        root.classList.remove('intro-lock');
        document.body.classList.add('intro-go');
        document.dispatchEvent(new CustomEvent('camcu:intro-done'));
        setIsVisible(false);
      };

      // Tách hai nửa màn hình dọc mở ra Hero (Section 9)
      const triggerCurtainSplit = (fast = false) => {
        if (exitingRef.current) return;
        exitingRef.current = true;

        const exitTl = gsap.timeline({ onComplete: finishIntro });

        exitTl
          .to([centerContent, skipBtn], {
            opacity: 0,
            duration: fast ? 0.15 : 0.3,
            ease: 'power2.in',
          })
          .to(
            leftHalf,
            {
              xPercent: -100,
              duration: fast ? 0.35 : 0.75,
              ease: 'power3.inOut',
            },
            fast ? 0.05 : 0.1
          )
          .to(
            rightHalf,
            {
              xPercent: 100,
              duration: fast ? 0.35 : 0.75,
              ease: 'power3.inOut',
            },
            fast ? 0.05 : 0.1
          )
          .add(() => document.body.classList.add('intro-go'), fast ? 0.1 : 0.3);
      };

      // Initial States
      gsap.set(emberLine, { scaleX: 0, opacity: 0 });
      gsap.set(titleChars, { y: 25, opacity: 0, filter: 'blur(16px)' });
      gsap.set(leftHalf, { xPercent: 0 });
      gsap.set(rightHalf, { xPercent: 0 });
      if (progressLine) gsap.set(progressLine, { scaleX: 0, transformOrigin: 'left' });

      const elevationState = { val: 0 };

      // Main Timeline (≤ 3.5s total)
      const tl = gsap.timeline({
        onComplete: () => {
          triggerCurtainSplit(false);
        },
      });

      tl
        // 1. Đường kẻ ember vẽ ngang
        .to(emberLine, {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
        }, 0.1)
        // 2. Chữ "CẨM CÙ HOUSE" hiện ký tự mờ -> nét
        .to(titleChars, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.035,
          ease: 'power2.out',
        }, 0.35)
        // 3. Bộ đếm mono 000 -> 800m cùng vạch tiến độ
        .to(elevationState, {
          val: 800,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            if (elevationEl) {
              const currentNum = Math.round(elevationState.val);
              elevationEl.textContent = `${String(currentNum).padStart(3, '0')} m`;
            }
          },
        }, 0.5)
        .to(progressLine, {
          scaleX: 1,
          duration: 1.8,
          ease: 'power2.out',
        }, 0.5);

      // Skip action & Escape key
      const handleSkip = () => triggerCurtainSplit(true);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dom.style.display !== 'none') {
          triggerCurtainSplit(true);
        }
      };

      skipBtn?.addEventListener('click', handleSkip);
      window.addEventListener('keydown', handleKeyDown);

      cleanup = () => {
        skipBtn?.removeEventListener('click', handleSkip);
        window.removeEventListener('keydown', handleKeyDown);
        tl.kill();
        gsap.killTweensOf('*');
      };
    }

    runIntro();

    return () => {
      cleanup();
      root.classList.remove('intro-lock');
    };
  }, []);

  if (!isVisible) return null;

  const titleString = 'CẨM CÙ HOUSE';

  return (
    <div
      id="camcu-intro-pro"
      ref={containerRef}
      role="dialog"
      aria-label="Khởi động Cẩm Cù House"
      className="fixed inset-0 z-[99999] bg-[#0A0E0C] text-[#F2EDE4] overflow-hidden select-none"
    >
      {/* Hai nửa màn hình tách dọc mở ra Hero (Section 9) */}
      <div
        id="intro-half-left"
        className="intro-half absolute top-0 left-0 w-1/2 h-full bg-[#0A0E0C] border-r border-[rgba(242,237,228,0.08)] z-10 pointer-events-none"
      />
      <div
        id="intro-half-right"
        className="intro-half absolute top-0 right-0 w-1/2 h-full bg-[#0A0E0C] border-l border-[rgba(242,237,228,0.08)] z-10 pointer-events-none"
      />

      {/* Nút Bỏ qua */}
      <button
        id="skip-btn"
        type="button"
        className="absolute top-6 right-6 z-40 px-4 py-2 border border-[rgba(242,237,228,0.2)] bg-[#101714]/80 hover:bg-[var(--ember)] hover:text-[#0A0E0C] text-[12px] font-mono tracking-wider text-[#F2EDE4] transition-all cursor-pointer backdrop-blur-md clip-chamfer-14"
        aria-label="Bỏ qua phần giới thiệu"
      >
        [BỎ QUA · ESC]
      </button>

      {/* Nội dung trung tâm */}
      <div
        id="intro-center"
        className="relative z-30 w-full h-full flex flex-col items-center justify-center px-6 pointer-events-none"
      >
        {/* Đường kẻ ember vẽ ngang */}
        <div
          id="intro-ember-line"
          className="w-full max-w-[640px] h-[2px] bg-gradient-to-r from-transparent via-[var(--ember)] to-transparent mb-8"
        />

        {/* Tọa độ mono & Nhãn */}
        <span className="font-mono text-[12px] uppercase tracking-[0.25em] text-[var(--ember)] mb-3 font-semibold">
          [11.99° N · 107.69° E · CAO NGUYÊN ĐẮK NÔNG]
        </span>

        {/* Chữ "CẨM CÙ HOUSE" hiện ký tự mờ -> nét */}
        <div className="overflow-visible pt-4 pb-2 mb-3">
          <h1 className="font-display text-[clamp(44px,9vw,110px)] font-black tracking-tight text-[#F2EDE4] flex justify-center flex-wrap leading-none uppercase">
            {titleString.split('').map((char, i) => (
              <span
                key={i}
                className="intro-char inline-block"
                style={{ minWidth: char === ' ' ? '0.35em' : 'auto' }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Tagline */}
        <p className="font-serif italic text-[16px] sm:text-[20px] text-[var(--ember)] tracking-wide mb-8">
          Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
        </p>

        {/* Bộ đếm mono 000 -> 800 m cùng vạch tiến độ */}
        <div className="flex flex-col items-center gap-2 w-48">
          <div className="flex items-center justify-between w-full font-mono text-[12px] uppercase text-[rgba(242,237,228,0.7)] tracking-wider">
            <span>ĐỘ CAO</span>
            <span
              id="elevation-num"
              className="text-[18px] font-bold text-[var(--ember-on-dark,#FF6A2B)] tabular-nums"
            >
              000 m
            </span>
          </div>
          <div className="w-full h-[2px] bg-[rgba(242,237,228,0.15)] overflow-hidden">
            <div
              id="elevation-progress"
              className="w-full h-full bg-[var(--ember-on-dark,#FF6A2B)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

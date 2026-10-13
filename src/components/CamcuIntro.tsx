'use client';

import { useEffect, useRef, useState } from 'react';
import StarHoya from '@/components/ui/StarHoya';
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
        return sessionStorage.getItem(STORAGE_KEY) === '1';
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

    // ── Khởi chạy Intro Diễn Hoạt Cao Nguyên ──
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
      const contourPaths = dom.querySelectorAll('.contour-path');
      const hoyaPath = dom.querySelector('.hoya-star-path') as SVGPathElement | null;
      const hoyaWrap = dom.querySelector('.hoya-wrap') as HTMLElement | null;
      const titleChars = dom.querySelectorAll('.intro-char');
      const taglineEl = dom.querySelector('.intro-tagline') as HTMLElement | null;
      const archPortal = dom.querySelector('.intro-arch-portal') as HTMLElement | null;
      const metaCoords = dom.querySelector('.intro-meta') as HTMLElement | null;

      // Finish & Dispatch
      const finishIntro = () => {
        markSeen();
        dom.style.display = 'none';
        root.classList.remove('intro-lock');
        document.body.classList.add('intro-go');
        document.dispatchEvent(new CustomEvent('camcu:intro-done'));
        setIsVisible(false);
      };

      // Arch Expansion Exit (Vòm lớn dần phủ toàn màn hình)
      const triggerArchExit = (fast = false) => {
        if (exitingRef.current) return;
        exitingRef.current = true;

        const exitTl = gsap.timeline({ onComplete: finishIntro });

        exitTl
          .to(['#skip-btn', '.intro-meta', '#elevation-box'], {
            opacity: 0,
            duration: fast ? 0.15 : 0.25,
            ease: 'power2.in',
          })
          .to(
            archPortal,
            {
              clipPath: 'circle(150% at 50% 50%)',
              opacity: 0,
              duration: fast ? 0.45 : 0.85,
              ease: 'power3.inOut',
            },
            0
          )
          .to(
            dom,
            {
              opacity: 0,
              duration: fast ? 0.35 : 0.65,
              ease: 'power2.inOut',
            },
            fast ? 0.15 : 0.35
          )
          .add(() => document.body.classList.add('intro-go'), fast ? 0.1 : 0.3);
      };

      // Set initial states
      gsap.set(contourPaths, { strokeDashoffset: 1200, opacity: 0 });
      if (hoyaPath) gsap.set(hoyaPath, { strokeDashoffset: 600, opacity: 0 });
      gsap.set(hoyaWrap, { scale: 0.6, rotation: -45, opacity: 0 });
      gsap.set(titleChars, { y: 60, opacity: 0 });
      gsap.set(taglineEl, { y: 20, opacity: 0 });
      gsap.set(metaCoords, { opacity: 0 });
      gsap.set(archPortal, {
        clipPath: 'inset(18% 28% 18% 28% round 999px 999px 28px 28px)',
        opacity: 1,
      });

      const elevationState = { val: 0 };

      // Main Timeline (≤ 3.5s total)
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => triggerArchExit(false), 200);
        },
      });

      tl
        // 1. Đường đồng mức vẽ nét từ giữa ra
        .to(metaCoords, { opacity: 1, duration: 0.4 }, 0.1)
        .to(
          contourPaths,
          {
            strokeDashoffset: 0,
            opacity: 0.25,
            duration: 1.8,
            stagger: 0.12,
            ease: 'power2.out',
          },
          0.1
        )
        // 2. Bộ đếm độ cao 0m -> 800m
        .to(
          elevationState,
          {
            val: 800,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate() {
              if (elevationEl) {
                elevationEl.textContent = `${Math.round(elevationState.val)}m`;
              }
            },
          },
          0.2
        )
        // 3. Hoa Hoya sao vẽ nét rồi nở
        .to(
          hoyaWrap,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: 'back.out(1.5)',
          },
          0.3
        )
        .to(
          hoyaPath,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'power2.out',
          },
          0.3
        )
        // 4. Chữ "CẨM CÙ HOUSE" hiện từng chữ (mask đủ chỗ cho dấu)
        .to(
          titleChars,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power3.out',
          },
          0.7
        )
        // 5. Tagline
        .to(
          taglineEl,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          1.2
        );

      // Skip action & Escape key
      const handleSkip = () => triggerArchExit(true);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dom.style.display !== 'none') {
          triggerArchExit(true);
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
      className="fixed inset-0 z-[99999] bg-[#1C1612] text-[#FDFBF7] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Vòm cổng mở rộng (Portal) */}
      <div
        className="intro-arch-portal absolute inset-0 pointer-events-none border border-[rgba(244,236,221,0.12)]"
        aria-hidden="true"
      />

      {/* Đường đồng mức SVG từ giữa tỏa ra */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <ellipse
          cx="500"
          cy="500"
          rx="180"
          ry="130"
          fill="none"
          stroke="rgba(244, 236, 221, 0.4)"
          strokeWidth="1.2"
          strokeDasharray="1200"
          className="contour-path"
        />
        <ellipse
          cx="500"
          cy="500"
          rx="320"
          ry="230"
          fill="none"
          stroke="rgba(244, 236, 221, 0.3)"
          strokeWidth="1.2"
          strokeDasharray="1200"
          className="contour-path"
        />
        <ellipse
          cx="500"
          cy="500"
          rx="460"
          ry="340"
          fill="none"
          stroke="rgba(244, 236, 221, 0.2)"
          strokeWidth="1.2"
          strokeDasharray="1200"
          className="contour-path"
        />
        <ellipse
          cx="500"
          cy="500"
          rx="600"
          ry="440"
          fill="none"
          stroke="rgba(244, 236, 221, 0.15)"
          strokeWidth="1.2"
          strokeDasharray="1200"
          className="contour-path"
        />
      </svg>

      {/* Nút Bỏ qua */}
      <button
        id="skip-btn"
        type="button"
        className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full border border-white/20 bg-black/30 hover:bg-white/10 text-xs font-mono tracking-wider text-white/80 transition-all cursor-pointer backdrop-blur-md"
        aria-label="Bỏ qua phần giới thiệu"
      >
        BỎ QUA (ESC) →
      </button>

      {/* Khối Tọa độ góc trên trái */}
      <div className="intro-meta absolute top-6 left-6 z-40 hidden sm:flex items-center gap-2 font-mono text-[11px] text-white/60 tracking-widest uppercase">
        <span>11.99° N · 107.69° E</span>
        <span>·</span>
        <span>GIA NGHĨA, ĐẮK NÔNG</span>
      </div>

      {/* Nội dung trung tâm */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-xl">
        {/* Hoa Hoya sao vẽ nét rồi nở */}
        <div className="hoya-wrap w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-6 text-[var(--basalt)]">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <path
              className="hoya-star-path"
              d="M50 8 L59 36 L89 36 L65 54 L74 82 L50 65 L26 82 L35 54 L11 36 L41 36 Z"
              stroke="#E0764F"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeDasharray="600"
              fill="rgba(224, 118, 79, 0.15)"
            />
          </svg>
        </div>

        {/* Chữ "CẨM CÙ HOUSE" hiện từng chữ (Mask có đủ padding-top cho dấu tiếng Việt) */}
        <div className="overflow-visible pt-3 pb-1 mb-3">
          <h1 className="font-serif text-[clamp(36px,7vw,76px)] font-bold tracking-[0.08em] text-[#FDFBF7] flex justify-center flex-wrap leading-[1.25]">
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
        <p className="intro-tagline font-serif italic text-[16px] sm:text-[19px] text-[var(--flower)] tracking-wide mb-6">
          Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
        </p>

        {/* Bộ đếm độ cao 0m -> 800m */}
        <div
          id="elevation-box"
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 border border-white/15 backdrop-blur-md"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">
            ĐỘ CAO ĐẠT ĐƯỢC
          </span>
          <span
            id="elevation-num"
            className="font-mono text-[20px] font-bold text-[var(--flower)] tabular-nums"
          >
            0m
          </span>
        </div>
      </div>
    </div>
  );
}

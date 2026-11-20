'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

/**
 * CINEMATIC INTRO 8K (120HZ / 120FPS GPU-ACCELERATED PRELOADER)
 *
 * Strict Guardrails:
 * - Storefront Only (never on /admin or /api/*)
 * - Zero WebGL context conflict (pure Canvas2D High-DPI particles + SVG geometry)
 * - SEO & SSR safe (page DOM renders underneath; unmounts completely after exit)
 * - Adaptive to Light / Dark mode and VI / EN
 */
export default function CinematicIntro8K() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('previewIntro') === '1';

  const { data, language, theme, enableAnimations } = useApp();
  const s = data.settings;
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  // Component lifecycle states
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isUnmounted, setIsUnmounted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const exitTriggeredRef = useRef<boolean>(false);

  // Eyebrow and Subtitle content from CMS
  const eyebrowText = useMemo(() => {
    if (isEn) {
      return s.introEyebrowEn || 'DONG GIA NGHIA • LAM DONG • ALLEY 437 HUNG VUONG';
    }
    return s.introEyebrowVi || 'ĐÔNG GIA NGHĨA • LÂM ĐỒNG • HẺM 437 HÙNG VƯƠNG';
  }, [isEn, s.introEyebrowEn, s.introEyebrowVi]);

  const subtitleText = useMemo(() => {
    if (isEn) {
      return s.introSubtitleEn || 'Streamside Ecological Café — Clean & Lush Sanctuary';
    }
    return s.introSubtitleVi || 'Cà phê sinh thái bên bờ suối — Xanh sạch & Trong lành';
  }, [isEn, s.introSubtitleEn, s.introSubtitleVi]);

  // Check eligibility on client mount
  useEffect(() => {
    // 1. Never run on admin or api routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) {
      setIsEligible(false);
      return;
    }

    // 2. If preview param is present, always allow
    if (isPreview) {
      setIsEligible(true);
      return;
    }

    // 3. Only run on storefront home route
    if (pathname !== '/') {
      setIsEligible(false);
      return;
    }

    // 4. Check CMS settings & animations
    if (s.enableIntro === false || enableAnimations === false) {
      setIsEligible(false);
      return;
    }

    // 5. Reduced motion compliance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsEligible(false);
      return;
    }

    // 6. Check Frequency (SESSION vs ALWAYS)
    if (s.introFrequency === 'ALWAYS') {
      setIsEligible(true);
      return;
    }

    // Default: SESSION frequency
    try {
      const alreadyViewed = sessionStorage.getItem('camcu_intro_viewed');
      if (alreadyViewed === 'true') {
        setIsEligible(false);
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    setIsEligible(true);
  }, [pathname, isPreview, s.enableIntro, s.introFrequency, enableAnimations]);

  // Scroll lock while intro is visible
  useEffect(() => {
    if (isEligible && !isUnmounted) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isEligible, isUnmounted]);

  // Trigger graceful exit
  const triggerExit = useCallback(() => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;
    setIsExiting(true);

    try {
      sessionStorage.setItem('camcu_intro_viewed', 'true');
    } catch {
      // Storage unavailable
    }

    // After Act III curtain animation (0.75s), unmount completely
    setTimeout(() => {
      setIsUnmounted(true);
      document.body.style.overflow = '';
    }, 780);
  }, []);

  // Listen to Escape key for instant skip
  useEffect(() => {
    if (!isEligible || isExiting || isUnmounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEligible, isExiting, isUnmounted, triggerExit]);

  // 120Hz/120fps Ambient Dew & Light-Ray High-DPI Canvas2D
  useEffect(() => {
    if (!isEligible || isUnmounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle seed: 42 subtle floating botanical micro-dew drops
    const PARTICLE_COUNT = 42;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.15 - Math.random() * 0.35, // slow upward drift like morning mist
      alpha: 0.15 + Math.random() * 0.45,
      pulseSpeed: 1.2 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2,
      isGold: Math.random() > 0.45,
    }));

    const INTRO_DURATION_MS = 2400; // 2.4s sequence
    let lastTime = performance.now();

    const renderFrame = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Update real-time counter progress
      if (!exitTriggeredRef.current) {
        const rawProgress = Math.min(elapsed / (INTRO_DURATION_MS * 0.8), 1);
        // Exponential ease out for counter
        const eased = Math.floor((1 - Math.pow(1 - rawProgress, 3)) * 100);
        setProgressPercent(eased);

        // Auto trigger exit when duration is reached
        if (elapsed >= INTRO_DURATION_MS) {
          triggerExit();
        }
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Soft Volumetric Radial Light Wash
      const centerX = width / 2;
      const centerY = height / 2 - 20;
      const lightRadius = Math.max(width, height) * 0.55;
      const lightGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        lightRadius
      );

      const breathing = Math.sin(now * 0.0018) * 0.03;
      if (isDark) {
        lightGradient.addColorStop(0, `rgba(76, 154, 103, ${0.11 + breathing})`);
        lightGradient.addColorStop(0.45, `rgba(200, 138, 85, ${0.05 + breathing * 0.5})`);
        lightGradient.addColorStop(1, 'rgba(13, 20, 16, 0)');
      } else {
        lightGradient.addColorStop(0, `rgba(46, 90, 60, ${0.07 + breathing})`);
        lightGradient.addColorStop(0.5, `rgba(184, 134, 11, ${0.04 + breathing * 0.5})`);
        lightGradient.addColorStop(1, 'rgba(246, 243, 236, 0)');
      }

      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Micro-Dew Mist Particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        p.x += p.vx * delta * 60;
        p.y += p.vy * delta * 60;

        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;

        const pulse = Math.sin(now * 0.002 * p.pulseSpeed + p.phase);
        const dynamicAlpha = Math.max(0.05, Math.min(p.alpha + pulse * 0.15, 0.85));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = p.isGold
            ? `rgba(200, 138, 85, ${dynamicAlpha})`
            : `rgba(76, 154, 103, ${dynamicAlpha * 0.85})`;
        } else {
          ctx.fillStyle = p.isGold
            ? `rgba(184, 134, 11, ${dynamicAlpha * 0.75})`
            : `rgba(46, 90, 60, ${dynamicAlpha * 0.6})`;
        }
        ctx.fill();
      }

      if (!isUnmounted) {
        rafIdRef.current = requestAnimationFrame(renderFrame);
      }
    };

    rafIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isEligible, isUnmounted, isDark, triggerExit]);

  // If on admin/api, not eligible, or unmounted after exit animation, return null
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/api') || !isEligible || isUnmounted) {
    return null;
  }

  // Color tokens
  const bgColor = isDark ? '#0D1410' : '#F6F3EC';
  const textPrimary = isDark ? '#F2EFE9' : '#1A241E';
  const accentBotanical = isDark ? '#4C9A67' : '#2E5A3C';
  const accentGold = isDark ? '#C88A55' : '#8C5A3C';
  const bracketStroke = isDark ? 'rgba(76, 154, 103, 0.45)' : 'rgba(46, 90, 60, 0.35)';
  const hairlineStroke = isDark ? 'rgba(242, 239, 233, 0.12)' : 'rgba(26, 36, 30, 0.1)';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cẩm Cù House Cinematic Intro"
      style={{
        backgroundColor: bgColor,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden"
    >
      {/* High-DPI Canvas for Floating Ambient Dew & Light Rays */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Optical Split-Curtain Panels for Act III Reveal */}
      <AnimatePresence>
        {isExiting && (
          <>
            {/* Top curtain sweeping upward */}
            <motion.div
              initial={{ transform: 'translate3d(0, 0%, 0)' }}
              animate={{ transform: 'translate3d(0, -100%, 0)' }}
              transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
              style={{
                backgroundColor: bgColor,
                borderBottom: `1px solid ${accentBotanical}`,
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
              className="absolute top-0 left-0 right-0 h-1/2 z-30 pointer-events-none"
            />
            {/* Bottom curtain sweeping downward */}
            <motion.div
              initial={{ transform: 'translate3d(0, 0%, 0)' }}
              animate={{ transform: 'translate3d(0, 100%, 0)' }}
              transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
              style={{
                backgroundColor: bgColor,
                borderTop: `1px solid ${accentBotanical}`,
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
              className="absolute bottom-0 left-0 right-0 h-1/2 z-30 pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Intro Stage Container */}
      <motion.div
        animate={
          isExiting
            ? {
                transform: 'translate3d(0, -22px, 0) scale3d(0.975, 0.975, 1)',
                opacity: 0,
              }
            : {
                transform: 'translate3d(0, 0px, 0) scale3d(1, 1, 1)',
                opacity: 1,
              }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
        className="relative z-10 w-full max-w-2xl px-6 sm:px-10 py-12 flex flex-col items-center text-center space-y-6"
      >
        {/* ACT I: Architectural Hairline Corner Brackets & Framing Rules */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-Left Bracket */}
          <svg className="absolute top-2 left-2 sm:top-4 sm:left-4 w-5 h-5" viewBox="0 0 20 20" fill="none">
            <motion.path
              d="M1 19 V1 H19"
              stroke={bracketStroke}
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          {/* Top-Right Bracket */}
          <svg className="absolute top-2 right-2 sm:top-4 sm:right-4 w-5 h-5" viewBox="0 0 20 20" fill="none">
            <motion.path
              d="M19 19 V1 H1"
              stroke={bracketStroke}
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          {/* Bottom-Left Bracket */}
          <svg className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-5 h-5" viewBox="0 0 20 20" fill="none">
            <motion.path
              d="M1 1 V19 H19"
              stroke={bracketStroke}
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          {/* Bottom-Right Bracket */}
          <svg className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-5 h-5" viewBox="0 0 20 20" fill="none">
            <motion.path
              d="M19 1 V19 H1"
              stroke={bracketStroke}
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>

        {/* ACT I: Minimalist Cẩm Cù (Hoya Flower) & Streamside Wave SVG Monogram */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Subtle Geometric Orbit */}
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              stroke={hairlineStroke}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Sinuous Streamside Water Wave Curve */}
            <motion.path
              d="M16 68 C 30 60, 42 76, 56 68 C 70 60, 78 72, 84 66"
              stroke={accentBotanical}
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.path
              d="M22 75 C 34 69, 46 81, 60 74 C 70 68, 76 76, 80 72"
              stroke={accentGold}
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.75"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 5-Petal Star Hoya Wax Flower Monogram */}
            {/* Star Outer Flower */}
            <motion.path
              d="M50 20 L57 37 L75 37 L61 48 L66 65 L50 54 L34 65 L39 48 L25 37 L43 37 Z"
              stroke={accentBotanical}
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, scale: 0.85, opacity: 0 } as any}
              animate={{ pathLength: 1, scale: 1, opacity: 1 } as any}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Inner Crown (Corona) */}
            <motion.path
              d="M50 33 L54 42 L63 42 L56 48 L59 57 L50 51 L41 57 L44 48 L37 42 L46 42 Z"
              stroke={accentGold}
              strokeWidth="1.25"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 } as any}
              animate={{ pathLength: 1, opacity: 1 } as any}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Central Pearl Dew Point */}
            <motion.circle
              cx="50"
              cy="46"
              r="2.5"
              fill={accentBotanical}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            />
          </svg>
        </div>

        {/* ACT II: Masked Kinetic Editorial Typography */}
        <div className="space-y-3 w-full">
          {/* Eyebrow Reveal */}
          <div className="overflow-hidden py-0.5">
            <motion.div
              initial={{ transform: 'translate3d(0, 100%, 0)' }}
              animate={{ transform: 'translate3d(0, 0%, 0)' }}
              transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform', color: accentBotanical }}
              className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold"
            >
              {eyebrowText}
            </motion.div>
          </div>

          {/* Main Headline Masked Kinetic Reveal */}
          <div className="overflow-hidden py-1">
            <motion.h1
              initial={{ transform: 'translate3d(0, 110%, 0)' }}
              animate={{ transform: 'translate3d(0, 0%, 0)' }}
              transition={{ duration: 0.75, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: textPrimary,
                willChange: 'transform',
              }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            >
              CẨM CÙ <span className="font-normal italic" style={{ color: accentBotanical }}>HOUSE</span>
            </motion.h1>
          </div>

          {/* Subtitle Reveal */}
          <div className="overflow-hidden py-0.5 max-w-lg mx-auto">
            <motion.p
              initial={{ transform: 'translate3d(0, 100%, 0)', opacity: 0 }}
              animate={{ transform: 'translate3d(0, 0%, 0)', opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
              className="text-xs sm:text-sm font-serif italic text-ink-muted leading-relaxed"
            >
              &ldquo;{subtitleText}&rdquo;
            </motion.p>
          </div>
        </div>

        {/* ACT II: Hairline Progress Rule & 120Hz Precision Counter */}
        <div className="w-full max-w-xs space-y-2 pt-2">
          {/* Hairline Progress Track */}
          <div
            style={{ backgroundColor: hairlineStroke }}
            className="w-full h-[1.5px] rounded-full overflow-hidden relative"
          >
            <motion.div
              style={{
                backgroundColor: accentBotanical,
                transformOrigin: 'left',
                transform: `scale3d(${progressPercent / 100}, 1, 1)`,
                willChange: 'transform',
              }}
              className="w-full h-full"
            />
          </div>

          {/* High-Precision Realtime Refresh Counter */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-ink-muted px-0.5">
            <span className="uppercase text-[9px] tracking-[0.2em]" style={{ color: accentBotanical }}>
              {isEn ? 'INITIALIZING SANCTUARY' : 'KHỞI TẠO KHÔNG GIAN'}
            </span>
            <span className="font-bold tabular-nums" style={{ color: textPrimary }}>
              {String(progressPercent).padStart(2, '0')}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Accessibility Instant Skip Control */}
      <motion.button
        type="button"
        onClick={triggerExit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        title="Bỏ qua màn hình mở màn (Phím ESC)"
        aria-label="Skip cinematic intro"
        style={{
          color: textPrimary,
          borderColor: hairlineStroke,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
        }}
        className="absolute bottom-6 right-6 z-20 px-3.5 py-1.5 rounded-full border text-[11px] font-mono tracking-wider hover:opacity-80 active:scale-95 transition-all flex items-center gap-1.5 backdrop-blur-sm cursor-pointer shadow-xs"
      >
        <span>{isEn ? 'Skip' : 'Bỏ qua'}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">
          ESC
        </span>
      </motion.button>
    </div>
  );
}

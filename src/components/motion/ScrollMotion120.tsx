'use client';

import React, { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  HTMLMotionProps,
} from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { EDITORIAL_EASE } from './EditorialMotion';

/**
 * 120Hz Spring Dynamics Configuration
 * High-frequency response tuned for 120Hz/144Hz displays with near-zero latency
 */
export const SPRING_120HZ = {
  stiffness: 320,
  damping: 34,
  mass: 0.35,
} as const;

/**
 * Top 120fps Hairline Reading Progress Bar with Glowing Leading Tip
 * Directly driven by hardware-accelerated scaleX of scrollYProgress
 */
export function ScrollReadingProgress120() {
  const pathname = usePathname();
  const { enableAnimations, motionIntensity } = useApp();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING_120HZ);

  if (pathname?.startsWith('/admin')) return null;
  if (!enableAnimations || motionIntensity === 'OFF') return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none overflow-visible"
    >
      <motion.div
        style={{
          scaleX,
          transformOrigin: 'left',
          backgroundColor: 'var(--accent-botanical, #2E5A3C)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        className="w-full h-full relative shadow-[0_0_10px_var(--accent-botanical,#2E5A3C)]"
      >
        {/* Luminous Glowing Leading Tip */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-emerald-300 shadow-[0_0_12px_#34d399,0_0_4px_#ffffff] -mr-1" />
      </motion.div>
    </div>
  );
}

/**
 * VelocityScrollGrid
 * High-FPS velocity-linked smooth scroll container: lightweight 2D translation without heavy 3D skews.
 */
interface VelocityScrollGridProps {
  children: React.ReactNode;
  className?: string;
  maxSkew?: number;
}

export function VelocityScrollGrid({
  children,
  className = '',
}: VelocityScrollGridProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * CurtainPhotoReveal
 * Organic botanical curtain reveal for gallery plates and hero photos.
 * Uses GPU-accelerated clip-path reveal with subtle counter-zoom scale.
 */
interface CurtainPhotoRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function CurtainPhotoReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.72,
}: CurtainPhotoRevealProps) {
  const { enableAnimations, motionIntensity } = useApp();

  if (!enableAnimations || motionIntensity === 'OFF') {
    return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{
          clipPath: 'inset(100% 0% 0% 0%)',
          scale: 1.08,
          opacity: 0.85,
        }}
        whileInView={{
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1.0,
          opacity: 1,
        }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{
          duration,
          delay,
          ease: EDITORIAL_EASE,
        }}
        style={{
          willChange: 'clip-path, transform, opacity',
          backfaceVisibility: 'hidden',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * ScrollLayoutCard3D
 * Lightweight 2D GPU-accelerated scroll elevation (opacity + translateY).
 * Zero 3D transforms, perspective(), rotateX/Y, or translateZ.
 */
interface ScrollLayoutCard3DProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollLayoutCard3D({
  children,
  delay = 0,
  className = '',
  style,
  ...rest
}: ScrollLayoutCard3DProps) {
  const { enableAnimations, motionIntensity } = useApp();

  if (!enableAnimations || motionIntensity === 'OFF') {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: motionIntensity === 'SUBTLE' ? 0.35 : 0.48,
        delay,
        ease: EDITORIAL_EASE,
      }}
      style={{
        willChange: 'transform, opacity',
        ...style,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollParallaxFrame
 * Continuous scroll-linked vertical parallax driven by 120Hz requestAnimationFrame spring
 */
interface ScrollParallaxFrameProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ScrollParallaxFrame({
  children,
  offset = 24,
  className = '',
}: ScrollParallaxFrameProps) {
  const { enableAnimations, motionIntensity } = useApp();
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const effectiveOffset = motionIntensity === 'SUBTLE' ? offset * 0.4 : offset;
  const rawY = useTransform(scrollYProgress, [0, 1], [-effectiveOffset, effectiveOffset]);
  const smoothY = useSpring(rawY, SPRING_120HZ);

  if (!enableAnimations || motionIntensity === 'OFF') {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={targetRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          y: smoothY,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * EditorialDivider120
 * 120fps hairline divider drawing smoothly from left to right on viewport intersection
 */
interface EditorialDivider120Props {
  className?: string;
  delay?: number;
}

export function EditorialDivider120({
  className = 'h-[1px] bg-slate-200/80 dark:bg-forest-700/60 my-8',
  delay = 0,
}: EditorialDivider120Props) {
  const { enableAnimations, motionIntensity } = useApp();

  if (!enableAnimations || motionIntensity === 'OFF') {
    return <div className={className} />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: EDITORIAL_EASE }}
      style={{
        transformOrigin: 'left',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
      className={className}
    />
  );
}

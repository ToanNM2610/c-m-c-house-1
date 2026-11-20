'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  useScroll,
  useVelocity,
  HTMLMotionProps,
} from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { EDITORIAL_EASE } from './EditorialMotion';

/**
 * 1. MagneticButton
 * Interactive magnetic attraction for primary CTAs.
 * Pulls up to ±8px towards cursor with botanical spring and diagonal light sheen.
 */
interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  sheen?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  intensity = 8,
  sheen = true,
  onClick,
  ...rest
}: MagneticButtonProps) {
  const { motionIntensity, enableAnimations } = useApp();
  const ref = useRef<HTMLButtonElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 20, mass: 0.2 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanHover(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canHover || !enableAnimations || motionIntensity === 'OFF') return;
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullX = ((e.clientX - centerX) / (rect.width / 2)) * (motionIntensity === 'SUBTLE' ? intensity * 0.4 : intensity);
    const pullY = ((e.clientY - centerY) / (rect.height / 2)) * (motionIntensity === 'SUBTLE' ? intensity * 0.4 : intensity);

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseEnter = () => {
    if (canHover) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  if (!enableAnimations || motionIntensity === 'OFF' || !canHover) {
    return (
      <button ref={ref} className={className} onClick={onClick} {...(rest as any)}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      style={{
        x: smoothX,
        y: smoothY,
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      {children}

      {/* Diagonal botanical light sheen sweep */}
      {sheen && isHovered && (
        <motion.span
          aria-hidden="true"
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: '120%', opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
          className="absolute inset-0 pointer-events-none -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}
    </motion.button>
  );
}

/**
 * 2. InteractiveTiltCard
 * Lightweight 2D GPU card transition (opacity + subtle translateY) with cursor-following radial spotlight.
 * Stripped of heavy 3D perspective, rotateX, rotateY, and preserve-3d.
 */
interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  spotlight?: boolean;
}

export function InteractiveTiltCard({
  children,
  className = '',
  spotlight = true,
}: InteractiveTiltCardProps) {
  const { motionIntensity, enableAnimations } = useApp();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isInside: false });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanHover(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !enableAnimations || motionIntensity === 'OFF') return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, isInside: true });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, isInside: false }));
  };

  if (!enableAnimations || motionIntensity === 'OFF' || !canHover) {
    return <div className={className}>{children}</div>;
  }

  const isSubtle = motionIntensity === 'SUBTLE';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: isSubtle ? -1.5 : -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        willChange: 'transform',
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Dynamic radial spotlight highlight following cursor (lightweight 2D) */}
      {spotlight && mousePos.isInside && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-inherit pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.11), transparent 80%)`,
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * 3. KineticTextReveal
 * Overflow-hidden masked line/word botanical text reveal at 120fps.
 */
interface KineticTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export function KineticTextReveal({
  text,
  className = '',
  delay = 0,
  as: Component = 'div',
}: KineticTextRevealProps) {
  const { motionIntensity, enableAnimations } = useApp();

  if (!enableAnimations || motionIntensity === 'OFF') {
    return <Component className={className}>{text}</Component>;
  }

  const words = text.split(' ');

  return (
    <Component className={`flex flex-wrap gap-x-[0.28em] overflow-hidden ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: '115%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.52,
              delay: delay + idx * 0.035,
              ease: EDITORIAL_EASE,
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}

/**
 * 4. StreamMarquee120
 * Ultra-smooth 120fps infinite horizontal botanical ribbon/ticker.
 * Responds dynamically to scroll velocity: user scrolling accelerates ribbon gently.
 */
interface StreamMarquee120Props {
  items?: string[];
  speed?: number; // base seconds per loop
  className?: string;
}

export function StreamMarquee120({
  items = [
    'Cà Phê Sinh Thái Bên Bờ Suối',
    '18 Bàn View Suối Mát Rượi',
    'Cà Phê Muối Đăk Nông Đậm Đà',
    'Thảo Mộc Xanh Sạch Tự Nhiên',
    'Đông Gia Nghĩa • Lâm Đồng',
    'Âm Nhạc Mộc Acoustic Cuối Tuần',
  ],
  speed = 32,
  className = '',
}: StreamMarquee120Props) {
  const { motionIntensity, enableAnimations } = useApp();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const [velocityMultiplier, setVelocityMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!enableAnimations || motionIntensity === 'OFF') return;

    return scrollVelocity.on('change', (latest) => {
      const absV = Math.abs(latest);
      if (absV > 100) {
        // Boost slightly on fast scroll (clamped to 2.2x)
        const boost = Math.min(1 + absV / 1200, 2.2);
        setVelocityMultiplier(boost);
      } else {
        setVelocityMultiplier(1);
      }
    });
  }, [scrollVelocity, enableAnimations, motionIntensity]);

  if (!enableAnimations || motionIntensity === 'OFF') {
    return (
      <div className={`py-3 overflow-hidden border-y border-forest-900/10 dark:border-forest-700/40 ${className}`}>
        <div className="flex gap-8 whitespace-nowrap justify-center text-xs tracking-widest uppercase opacity-75 font-mono">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              <span>{item}</span>
              <span className="text-accent-botanical">•</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  const effectiveDuration = speed / velocityMultiplier;

  // Duplicate items 4 times for seamless infinite loop
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`py-3.5 overflow-hidden border-y border-forest-900/10 dark:border-forest-700/30 bg-paper/60 backdrop-blur-xs select-none ${className}`}
    >
      <motion.div
        animate={{
          x: isPaused ? undefined : ['0%', '-50%'],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: effectiveDuration,
          ease: 'linear',
        }}
        className="flex gap-8 whitespace-nowrap will-change-transform font-mono text-[11px] sm:text-xs uppercase tracking-widest text-ink-secondary"
      >
        {repeatedItems.map((item, idx) => (
          <span key={idx} className="flex items-center gap-6 shrink-0">
            <span className="hover:text-accent-botanical transition-colors duration-200">
              {item}
            </span>
            <span className="text-accent-botanical/60 text-[9px] font-bold">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}


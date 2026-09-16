'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CinematicRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'none';
  className?: string;
}

/**
 * CinematicReveal — Scroll-triggered reveal component.
 * Wraps any content and animates it in softly as it enters the viewport.
 * Uses only GPU-composited properties (opacity + transform) for 60-120fps performance.
 */
export function CinematicReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: CinematicRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: direction === 'up' ? 20 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -30px 0px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      style={{ willChange: 'opacity, transform', transform: 'translate3d(0,0,0)' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

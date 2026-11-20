'use client';

import React from 'react';
import { motion, MotionConfig, HTMLMotionProps } from 'framer-motion';
import { useApp } from '@/context/AppContext';

/**
 * Editorial Botanical Easing Curve
 * Calm, unhurried, magazine-grade transition curve: [0.22, 1, 0.36, 1]
 */
export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export const EDITORIAL_TRANSITION = {
  duration: 0.45,
  ease: EDITORIAL_EASE,
};

export const SPRING_PILL_TRANSITION = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
};

/**
 * Root Motion Config Wrapper
 * Honors OS/browser reduced-motion setting and CMS motion toggle
 */
export function EditorialMotionProvider({ children }: { children: React.ReactNode }) {
  const { enableAnimations } = useApp();

  return (
    <MotionConfig
      reducedMotion="user"
      transition={enableAnimations ? EDITORIAL_TRANSITION : { duration: 0 }}
    >
      {children}
    </MotionConfig>
  );
}

/**
 * Editorial Page Route Transition
 * Initial: opacity 0, y 12
 * Animate: opacity 1, y 0 (0.45s, ease [0.22, 1, 0.36, 1])
 */
export function EditorialPageTransition({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { enableAnimations } = useApp();

  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Editorial Hairline Divider
 * Scales smoothly from left to right on viewport entry
 */
interface EditorialDividerProps {
  className?: string;
  delay?: number;
}

export function EditorialDivider({ className = 'h-[1px] bg-slate-200/80 my-8', delay = 0 }: EditorialDividerProps) {
  const { enableAnimations } = useApp();

  if (!enableAnimations) {
    return <div className={className} />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: EDITORIAL_EASE }}
      style={{ transformOrigin: 'left' }}
      className={className}
    />
  );
}

/**
 * Editorial Section & Card Reveal
 * Soft upward drift + opacity fade when scrolled into view
 */
interface EditorialRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function EditorialReveal({
  children,
  delay = 0,
  duration = 0.55,
  yOffset = 16,
  className = '',
  ...rest
}: EditorialRevealProps) {
  const { enableAnimations } = useApp();

  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration, delay, ease: EDITORIAL_EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Editorial Stagger Container for list of items/cards
 */
export function EditorialStaggerContainer({
  children,
  staggerChildren = 0.08,
  delayChildren = 0.05,
  className = '',
}: {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
}) {
  const { enableAnimations } = useApp();

  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item inside an EditorialStaggerContainer
 */
export function EditorialStaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { enableAnimations } = useApp();

  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: EDITORIAL_EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useNavigationDirection } from '@/context/NavigationDirectionContext';
import { EditorialMotionProvider, EDITORIAL_EASE } from '@/components/motion/EditorialMotion';
import NavigationProgress from '@/components/motion/NavigationProgress';
import { ScrollReadingProgress120 } from '@/components/motion/ScrollMotion120';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { enableAnimations, motionIntensity } = useApp();
  const { direction } = useNavigationDirection();
  const [animationFinished, setAnimationFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Skip 3D transitions and animations in admin console
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  // If user disabled animations in CMS or reduced motion is active
  if (!enableAnimations || motionIntensity === 'OFF') {
    return (
      <EditorialMotionProvider>
        <NavigationProgress />
        <div className="w-full">{children}</div>
      </EditorialMotionProvider>
    );
  }

  const isSubtle = motionIntensity === 'SUBTLE';

  // Lightweight 2D initial pose based on spatial route direction (+1 = right, -1 = left, 0 = neutral)
  let initialX = 0;
  let initialY = isSubtle ? 8 : 14;

  if (direction > 0) {
    // Navigating towards right in route order
    initialX = isSubtle ? 3 : 6;
    initialY = 0;
  } else if (direction < 0) {
    // Navigating towards left in route order
    initialX = isSubtle ? -3 : -6;
    initialY = 0;
  }

  const handleAnimationComplete = () => {
    setAnimationFinished(true);
    // CRITICAL: Explicitly clear transform so position:sticky headers (e.g. /thuc-don category tabs)
    // are not constrained by an ancestor CSS transform containing block.
    if (containerRef.current) {
      containerRef.current.style.transform = 'none';
    }
  };

  return (
    <EditorialMotionProvider>
      {/* 120fps Hardware-Accelerated Reading Progress Bar */}
      <ScrollReadingProgress120 />
      {/* Editorial Hairline Route Navigation Progress Indicator */}
      <NavigationProgress />

      {/* Directional Translucent Botanical Light-Veil Sweep Overlay */}
      {!animationFinished && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
        >
          {direction > 0 ? (
            <motion.div
              initial={{ x: '-100%', opacity: isSubtle ? 0.3 : 0.6 }}
              animate={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.52, ease: EDITORIAL_EASE }}
              className="w-full h-full bg-gradient-to-r from-transparent via-accent-botanical/15 dark:via-emerald-400/15 to-transparent backdrop-blur-[2px]"
            />
          ) : direction < 0 ? (
            <motion.div
              initial={{ x: '100%', opacity: isSubtle ? 0.3 : 0.6 }}
              animate={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.52, ease: EDITORIAL_EASE }}
              className="w-full h-full bg-gradient-to-l from-transparent via-accent-botanical/15 dark:via-emerald-400/15 to-transparent backdrop-blur-[2px]"
            />
          ) : (
            <motion.div
              initial={{ opacity: isSubtle ? 0.25 : 0.45 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.48, ease: EDITORIAL_EASE }}
              className="w-full h-full bg-accent-botanical/10 dark:bg-emerald-400/10 backdrop-blur-[1px]"
            />
          )}
        </div>
      )}

      {/* Directional 2D Route Transition Wrapper (opacity + translate only) */}
      <motion.div
        ref={containerRef}
        initial={{
          opacity: 0,
          x: initialX,
          y: initialY,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
        }}
        transition={{
          duration: isSubtle ? 0.36 : 0.48,
          ease: EDITORIAL_EASE,
        }}
        onAnimationComplete={handleAnimationComplete}
        style={{
          transform: animationFinished ? 'none' : undefined,
          willChange: animationFinished ? 'auto' : 'transform, opacity',
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </EditorialMotionProvider>
  );
}

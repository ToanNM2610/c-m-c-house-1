'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useNavigationDirection } from '@/context/NavigationDirectionContext';
import { EditorialMotionProvider } from '@/components/motion/EditorialMotion';
import NavigationProgress from '@/components/motion/NavigationProgress';
import { ScrollReadingProgress120 } from '@/components/motion/ScrollMotion120';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { enableAnimations, motionIntensity } = useApp();
  const { direction } = useNavigationDirection();
  const [animationFinished, setAnimationFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Strictly skip all transitions and wrappers in admin console
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  // If user disabled animations or reduced motion is active
  if (!enableAnimations || motionIntensity === 'OFF') {
    return (
      <EditorialMotionProvider>
        <NavigationProgress />
        <div className="w-full">{children}</div>
      </EditorialMotionProvider>
    );
  }

  const handleAnimationComplete = () => {
    setAnimationFinished(true);
    // Explicitly clear transform so position:sticky elements aren't constrained
    if (containerRef.current) {
      containerRef.current.style.transform = 'none';
    }
  };

  return (
    <EditorialMotionProvider>
      {/* 120fps Reading Progress Bar */}
      <ScrollReadingProgress120 />
      {/* Editorial Route Navigation Progress Indicator */}
      <NavigationProgress />

      {/* Fast, silky-smooth 2D GPU fade-slide (zero lag, no backdrop-blur) */}
      <motion.div
        ref={containerRef}
        initial={{
          opacity: 0,
          x: direction * 12,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.18,
          ease: 'easeOut',
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

'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

export default function NavigationProgress() {
  const pathname = usePathname();
  const { enableAnimations } = useApp();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!enableAnimations) return;

    // Trigger subtle top progress bar whenever route pathname changes
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname, enableAnimations]);

  if (!enableAnimations) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none overflow-hidden"
    >
      <AnimatePresence>
        {animating && (
          <motion.div
            key={pathname}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              scaleX: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.2, delay: 0.25 },
            }}
            style={{
              transformOrigin: 'left',
              backgroundColor: 'var(--accent-botanical, #2E5A3C)',
            }}
            className="w-full h-full shadow-[0_0_8px_var(--accent-botanical,#2E5A3C)]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}


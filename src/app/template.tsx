'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.995 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: 'opacity, transform', transform: 'translate3d(0,0,0)' }}
      className="relative z-10 w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}

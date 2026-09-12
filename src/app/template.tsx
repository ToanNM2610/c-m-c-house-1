'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Next.js App Router Global Page Template
 * Kích hoạt hiệu ứng chuyển trang điện ảnh (Cross-fade & Micro-dolly zoom) mỗi khi đổi URL,
 * tự động cuộn về đỉnh trang ngay lập tức để chống kẹt vị trí cuộn cũ,
 * không làm ngắt quãng WebGL Canvas Singleton và âm thanh nền.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  useEffect(() => {
    // Cuộn mượt/tức thì về đầu trang khi chuyển đổi route
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis
    ) {
      (window as unknown as { __lenis: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const isAdmin = pathname.startsWith('/portal-camcu-2610') || pathname.startsWith('/wp-admin');
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.99 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1], // Cubic-bezier Awwwards sang trọng
      }}
      style={{
        transform: 'translate3d(0,0,0)',
        willChange: 'opacity, transform',
      }}
      className="relative z-10 w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}

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

  return <div className="relative z-10 w-full min-h-screen">{children}</div>;
}

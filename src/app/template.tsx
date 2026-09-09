'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Next.js App Router Template
 * Tự động bọc nội dung và kích hoạt chuỗi hiệu ứng chuyển trang mềm mại (Page Transition)
 * mỗi khi đổi URL (/ -> /about -> /space -> /menu -> /contact) mà không làm unmount
 * WebGL Canvas Singleton và Navbar/Footer ở layout.tsx.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  useEffect(() => {
    // Scroll lên đầu trang mượt mà ngay khi đổi URL
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (typeof window !== 'undefined' && (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis) {
      (window as unknown as { __lenis: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const isAdmin = pathname.startsWith('/portal-camcu-2610') || pathname.startsWith('/wp-admin');
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Cubic-bezier chuẩn Awwwards
      }}
      className="relative z-10 w-full"
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </motion.main>
  );
}

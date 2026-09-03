'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const slideEase = [0.76, 0, 0.24, 1] as const;
const contentEase = [0.22, 1, 0.36, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Bỏ qua rèm chuyển cảnh trên trang quản trị
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      {/* ======================================================== */}
      {/* LỚP 1 (ACCENT): MÀN VÀNG KIM (#C5A880) - LƯỚT DẪN ĐẦU    */}
      {/* ======================================================== */}
      <motion.div
        key={`slide-accent-${pathname}`}
        className="fixed inset-0 z-[9998] bg-[#C5A880] pointer-events-none"
        initial={{ y: '100%' }}
        animate={{ y: ['100%', '0%', '-100%'] }}
        transition={{
          duration: 1.0,
          times: [0, 0.48, 1],
          ease: slideEase,
        }}
      />

      {/* ======================================================== */}
      {/* LỚP 2 (MAIN): MÀN NÂU GỖ CÀ PHÊ (#1A0F0A) - THEO SAU   */}
      {/* ======================================================== */}
      <motion.div
        key={`slide-main-${pathname}`}
        className="fixed inset-0 z-[9999] bg-[#1A0F0A] pointer-events-none"
        initial={{ y: '100%' }}
        animate={{ y: ['100%', '0%', '-100%'] }}
        transition={{
          duration: 1.0,
          delay: 0.06,
          times: [0, 0.48, 1],
          ease: slideEase,
        }}
      />

      {/* ======================================================== */}
      {/* NỘI DUNG TRANG (CHILDREN): TRỒI NHẸ VÀ FADE IN DỊU DÀNG  */}
      {/* ======================================================== */}
      <motion.div
        key={`page-content-${pathname}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.46,
          ease: contentEase,
        }}
        className="w-full min-h-screen overflow-x-hidden"
      >
        {children}
      </motion.div>
    </>
  );
}

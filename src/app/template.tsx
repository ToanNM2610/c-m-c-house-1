'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Cấu hình 3 trạng thái của đường cong SVG Liquid Reveal:
// 1. Initial: Đường cong võng sâu xuống đáy với đỉnh bụng tại Y=200
const initialPath = 'M 0 0 L 100 0 L 100 100 Q 50 200 0 100 Z';
// 2. Flat (Enter): Rèm dâng lên che trọn màn hình phẳng tuyệt đối tại Y=100
const flatPath = 'M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z';
// 3. Exit (Reveal): Rèm uốn cong kéo vút lên trên đỉnh biến mất tại Y=0
const exitPath = 'M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z';

const transitionEase = [0.76, 0, 0.24, 1] as const;
const contentEase = [0.22, 1, 0.36, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Bỏ qua animation rèm trên trang quản trị
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      {/* ======================================================== */}
      {/* TẦNG 1: LỚP RÈM VÀNG ĐỒNG (#C5A880) - LƯỚT DẪN ĐẦU       */}
      {/* ======================================================== */}
      <svg
        key={`curtain-gold-${pathname}`}
        className="fixed inset-0 w-full h-full z-[9998] pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ d: initialPath, opacity: 1 }}
          animate={{
            d: [initialPath, flatPath, exitPath],
            opacity: [1, 1, 0],
          }}
          transition={{
            d: {
              duration: 1.15,
              times: [0, 0.48, 1],
              ease: transitionEase,
            },
            opacity: {
              duration: 1.15,
              times: [0, 0.92, 1],
              ease: 'linear',
            },
          }}
          fill="#C5A880"
        />
      </svg>

      {/* ======================================================== */}
      {/* TẦNG 2: LỚP RÈM NÂU GỖ TRẦM (#1A0F0A) - TRỄ 0.08S        */}
      {/* ======================================================== */}
      <svg
        key={`curtain-dark-${pathname}`}
        className="fixed inset-0 w-full h-full z-[9999] pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ d: initialPath, opacity: 1 }}
          animate={{
            d: [initialPath, flatPath, exitPath],
            opacity: [1, 1, 0],
          }}
          transition={{
            d: {
              duration: 1.15,
              delay: 0.08,
              times: [0, 0.48, 1],
              ease: transitionEase,
            },
            opacity: {
              duration: 1.15,
              delay: 0.08,
              times: [0, 0.92, 1],
              ease: 'linear',
            },
          }}
          fill="#1A0F0A"
        />
      </svg>

      {/* ======================================================== */}
      {/* NỘI DUNG TRANG: FADE IN VÀ TRỒI NHẸ KHI RÈM THU LÊN ĐỈNH */}
      {/* ======================================================== */}
      <motion.div
        key={`page-content-${pathname}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: 0.52,
          ease: contentEase,
        }}
        className="w-full min-h-screen overflow-x-hidden"
      >
        {children}
      </motion.div>
    </>
  );
}

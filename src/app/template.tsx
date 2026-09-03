'use client';

import { motion, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Cấu hình trạng thái khởi tạo (initial) cho 6 route độc bản
const getInitialVariant = (pathname: string) => {
  // 1. Trang chủ ('/') -> [THE PORTAL]: Nở nhẹ từ tâm, scale 0.94 -> 1.0, opacity 0 -> 1
  if (pathname === '/') {
    return { opacity: 0, scale: 0.94, x: 0, y: 0, filter: 'blur(0px)' };
  }
  // 2. Giới thiệu ('/about') -> [JOURNAL SLIDE]: Lật mở trang ký ức, trượt ngang từ trái sang (x: -50 -> 0)
  if (pathname.startsWith('/about')) {
    return { opacity: 0, scale: 1, x: -50, y: 0, filter: 'blur(0px)' };
  }
  // 3. Không gian ('/space') -> [CANOPY DESCENT]: Hạ từ trên tán cây xuống (y: -40 -> 0)
  if (pathname.startsWith('/space')) {
    return { opacity: 0, scale: 1, x: 0, y: -40, filter: 'blur(0px)' };
  }
  // 4. Thực đơn ('/menu') -> [TRAY LIFT]: Nâng khay gỗ từ đáy lên (y: 50 -> 0)
  if (pathname.startsWith('/menu')) {
    return { opacity: 0, scale: 1, x: 0, y: 50, filter: 'blur(0px)' };
  }
  // 5. Chuyện nhà ('/posts') -> [AMBER DISSOLVE]: Tan biến mờ ảo blur(8px) -> blur(0px) cùng opacity
  if (pathname.startsWith('/posts')) {
    return { opacity: 0, scale: 1, x: 0, y: 0, filter: 'blur(8px)' };
  }
  // 6. Liên hệ ('/contact') -> [CURTAIN OPEN]: Trượt dứt khoát từ phải qua (x: 50 -> 0)
  if (pathname.startsWith('/contact')) {
    return { opacity: 0, scale: 1, x: 50, y: 0, filter: 'blur(0px)' };
  }
  // Mặc định cho các route khác (như /posts/[id])
  return { opacity: 0, scale: 1, x: 0, y: 30, filter: 'blur(0px)' };
};

const pageVariants: Variants = {
  initial: (pathname: string) => getInitialVariant(pathname),
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Bỏ qua animation trên trang quản trị
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      {/* VỆT CHỈ VÀNG ĐỒNG ĐIỆN ẢNH (CINEMATIC GOLD RUNNER): tự quét ngang từ 0% đến 100% trong 0.4s */}
      <motion.div
        key={`gold-runner-${pathname}`}
        className="h-[2px] bg-[#C5A880] fixed top-0 left-0 right-0 z-50 origin-left pointer-events-none"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          scaleX: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
          opacity: { duration: 0.4, times: [0, 0.85, 1], ease: 'linear' },
        }}
      />

      {/* KHUNG NỘI DUNG VỚI 6 BIẾN THỂ CHUYỂN CẢNH ĐỘC BẢN */}
      <motion.div
        key={pathname}
        custom={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="w-full min-h-screen overflow-x-hidden"
      >
        {children}
      </motion.div>
    </>
  );
}

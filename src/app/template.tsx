'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Gia tốc chuẩn từ transitions.dev motion tokens
const slideEase = [0.76, 0, 0.24, 1] as const;
const contentEase = [0.22, 1, 0.36, 1] as const;

// 6 hiệu ứng độc bản cho từng route khi rèm mở ra
const getRouteVariant = (pathname: string) => {
  // 1. '/' (Trang chủ): Bung nở từ tâm (scale: 0.94 -> 1)
  if (pathname === '/') {
    return {
      initial: { opacity: 0, scale: 0.94, x: 0, y: 0, filter: 'blur(0px)' },
      animate: { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' },
    };
  }
  // 2. '/about' (Giới thiệu): Trượt ngang từ mép trái (x: -50 -> 0)
  if (pathname.startsWith('/about')) {
    return {
      initial: { opacity: 0, scale: 1, x: -50, y: 0, filter: 'blur(0px)' },
      animate: { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' },
    };
  }
  // 3. '/space' (Không gian): Hạ dần từ trên xuống (y: -50 -> 0)
  if (pathname.startsWith('/space')) {
    return {
      initial: { opacity: 0, scale: 1, x: 0, y: -50, filter: 'blur(0px)' },
      animate: { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' },
    };
  }
  // 4. '/menu' (Thực đơn): Trồi êm từ dưới đáy lên (y: 50 -> 0)
  if (pathname.startsWith('/menu')) {
    return {
      initial: { opacity: 0, scale: 1, x: 0, y: 50, filter: 'blur(0px)' },
      animate: { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' },
    };
  }
  // 5. '/posts' (Chuyện nhà): Hiệu ứng mờ ảo rõ dần (filter: blur(8px) -> blur(0px))
  if (pathname.startsWith('/posts')) {
    return {
      initial: { opacity: 0, scale: 1, x: 0, y: 0, filter: 'blur(8px)' },
      animate: { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' },
    };
  }
  // 6. '/contact' (Liên hệ): Lướt dứt khoát từ phải qua (x: 50 -> 0)
  if (pathname.startsWith('/contact')) {
    return {
      initial: { opacity: 0, scale: 1, x: 50, y: 0, filter: 'blur(0px)' },
      animate: { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' },
    };
  }
  // Mặc định
  return {
    initial: { opacity: 0, scale: 1, x: 0, y: 20, filter: 'blur(0px)' },
    animate: { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' },
  };
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const routeVariants = getRouteVariant(pathname);

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
      {/* NỘI DUNG TRANG (CHILDREN): KẾT HỢP 6 HIỆU ỨNG ĐỘC BẢN     */}
      {/* ======================================================== */}
      <motion.div
        key={`page-content-${pathname}`}
        initial={routeVariants.initial}
        animate={routeVariants.animate}
        transition={{
          duration: 0.5,
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

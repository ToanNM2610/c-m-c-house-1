'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Bộ 4 tọa độ SVG định hình đường cong chất lỏng (Curved SVG Liquid Reveal)
// 1. Initial: Rèm võng sâu xuống đáy màn hình với đỉnh bụng tại Y=200
const initialPath = 'M 0 0 L 100 0 L 100 100 Q 50 200 0 100 Z';
// 2. Flat (Enter): Rèm dâng lên căng phẳng che trọn màn hình tại Y=100
const flatPath = 'M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z';
// 3. Arch (Exit): Đỉnh vòm được kéo vút lên trên đỉnh màn hình tạo vòm cong nghệ thuật
const archPath = 'M 0 0 L 100 0 L 100 0 Q 50 -40 0 0 Z';
// 4. End: Rèm thu gọn hoàn toàn vào mép trên màn hình
const exitPath = 'M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z';

const liquidEase = [0.76, 0, 0.24, 1] as const;
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
      {/* TẦNG 1: LỚP CHỈ VÀNG HOÀNG GIA (#C5A880) - LƯỚT DẪN ĐẦU  */}
      {/* ======================================================== */}
      <svg
        key={`curtain-gold-${pathname}`}
        className="fixed inset-0 w-full h-full z-[9998] pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ d: initialPath }}
          animate={{ d: [initialPath, flatPath, archPath, exitPath] }}
          transition={{
            duration: 0.75,
            times: [0, 0.35, 0.85, 1],
            ease: liquidEase,
          }}
          fill="#C5A880"
        />
      </svg>

      {/* ======================================================== */}
      {/* TẦNG 2: LỚP RÈM LỤA CÀ PHÊ MỘC (#1A0F0A) - TRỄ 0.08S     */}
      {/* ======================================================== */}
      <svg
        key={`curtain-dark-${pathname}`}
        className="fixed inset-0 w-full h-full z-[9999] pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ d: initialPath }}
          animate={{ d: [initialPath, flatPath, archPath, exitPath] }}
          transition={{
            duration: 0.75,
            delay: 0.08,
            times: [0, 0.35, 0.85, 1],
            ease: liquidEase,
          }}
          fill="#1A0F0A"
        />
      </svg>

      {/* ======================================================== */}
      {/* CHUYỂN ĐỘNG NỘI DUNG TRANG: SCALE 0.98 -> 1, Y: 20 -> 0   */}
      {/* ======================================================== */}
      <motion.div
        key={`page-content-${pathname}`}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.65,
          delay: 0.26,
          ease: contentEase,
        }}
        className="w-full min-h-screen overflow-x-hidden"
      >
        {children}
      </motion.div>
    </>
  );
}

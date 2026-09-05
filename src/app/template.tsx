'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  useEffect(() => {
    // Cuộn tức thì lên đầu trang khi đổi route
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // Không can thiệp vào khu vực Admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/wp-admin')) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full min-h-screen bg-[#1A0F0A]"
    >
      {children}
    </motion.div>
  );
}

"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import PageTransitionCurtain from "@/components/motion/PageTransitionCurtain";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [showCurtain, setShowCurtain] = useState(!isAdmin);

  // Màn che tự ẩn sau khi hoàn thành animation
  useEffect(() => {
    if (isAdmin) {
      setShowCurtain(false);
      return;
    }
    setShowCurtain(true);
    const timer = setTimeout(() => {
      setShowCurtain(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, [pathname, isAdmin]);

  // Nếu là trang Admin, không chạy hiệu ứng chuyển cảnh để tránh kẹt giao diện
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* Màn che chuyển cảnh xanh rêu + Circle Reveal + Tên trang & Logo */}
      <AnimatePresence mode="wait">
        {showCurtain && (
          <PageTransitionCurtain onComplete={() => setShowCurtain(false)} />
        )}
      </AnimatePresence>

      {/* Nội dung trang: Ẩn trang cũ trước, hiện trang mới êm ái khi rèm mở */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

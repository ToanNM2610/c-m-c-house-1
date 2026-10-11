"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransitionCurtain from "@/components/motion/PageTransitionCurtain";

export default function Template({ children }: { children: ReactNode }) {
  const [showCurtain, setShowCurtain] = useState(true);

  // Màn che tự ẩn sau khi hoàn thành animation
  useEffect(() => {
    setShowCurtain(true);
    const timer = setTimeout(() => {
      setShowCurtain(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FDFBF7] dark:bg-[#121A15] transition-colors duration-300">
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

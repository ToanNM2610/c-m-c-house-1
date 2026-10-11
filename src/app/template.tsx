"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransitionCurtain from "@/components/motion/PageTransitionCurtain";

export default function Template({ children }: { children: ReactNode }) {
  const [showCurtain, setShowCurtain] = useState(true);

  // Màn che tự ẩn sau khi hoàn thành animation trượt lên
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtain(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FDFBF7] dark:bg-[#121A15] transition-colors duration-300">
      {/* Màn che trượt lên màu nâu #3E2723 kèm logo Cẩm Cù House */}
      <AnimatePresence mode="wait">
        {showCurtain && (
          <PageTransitionCurtain onComplete={() => setShowCurtain(false)} />
        )}
      </AnimatePresence>

      {/* Nội dung trang: Cross-fade mượt mà tông kem ấm #FDFBF7 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1] as const,
          delay: 0.25, // Bắt đầu hiện rõ dần khi màn che nâu đang trượt lên
        }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

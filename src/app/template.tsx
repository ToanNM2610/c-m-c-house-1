"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransitionCurtain from "@/components/motion/PageTransitionCurtain";
import { useTransitionContext } from "@/context/TransitionContext";

export default function Template({ children }: { children: ReactNode }) {
  const [showCurtain, setShowCurtain] = useState(true);
  const { mode, direction } = useTransitionContext();

  // Màn che tự ẩn sau khi hoàn thành animation
  useEffect(() => {
    setShowCurtain(true);
    const timer = setTimeout(() => {
      setShowCurtain(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Tính toán animation tương ứng theo mode
  const getMotionConfig = () => {
    switch (mode) {
      case "slide-directional":
        return {
          initial: { opacity: 0, x: direction >= 0 ? 50 : -50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 },
        };
      case "depth-push":
        return {
          initial: { opacity: 0, scale: 0.94, y: 18 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 },
        };
      case "cross-fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.45, ease: "easeInOut" as const },
        };
      case "stagger-panels":
      case "curtain-wipe":
      default:
        return {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const, delay: 0.28 },
        };
    }
  };

  const motionConfig = getMotionConfig();

  return (
    <div className="relative min-h-screen w-full bg-[#FDFBF7] dark:bg-[#121A15] transition-colors duration-300">
      {/* Màn che chuyển cảnh điện ảnh theo chế độ đã chọn */}
      <AnimatePresence mode="wait">
        {showCurtain && (
          <PageTransitionCurtain onComplete={() => setShowCurtain(false)} />
        )}
      </AnimatePresence>

      {/* Nội dung trang: Trượt và cross-fade theo chế độ */}
      <motion.div
        initial={motionConfig.initial}
        animate={motionConfig.animate}
        transition={motionConfig.transition}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

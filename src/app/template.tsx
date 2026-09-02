'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Transition setup cho nội dung
const getInitialState = (pathname: string) => {
  if (pathname === "/") return { scale: 0.94, opacity: 0 };
  if (pathname.startsWith("/about")) return { x: -60, opacity: 0 };
  if (pathname.startsWith("/space")) return { y: -50, opacity: 0 };
  if (pathname.startsWith("/menu")) return { y: 60, opacity: 0 };
  if (pathname.startsWith("/posts")) return { filter: 'blur(10px)', opacity: 0 };
  if (pathname.startsWith("/contact")) return { x: 60, opacity: 0 };
  return { opacity: 0, y: 20 };
};

const getAnimateState = (pathname: string) => {
  if (pathname.startsWith("/posts")) return { filter: 'blur(0px)', opacity: 1 };
  return { scale: 1, x: 0, y: 0, opacity: 1 };
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // 1. VỆT CHỈ ĐIỆN ẢNH (CINEMATIC GOLD RUNNER)
  // 2. CHUYỂN CẢNH ĐỘNG
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname + "runner"}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-[#C5A880] z-[9999] origin-left pointer-events-none"
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={getInitialState(pathname)}
          animate={getAnimateState(pathname)}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full min-h-screen overflow-x-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

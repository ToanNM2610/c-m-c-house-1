"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import PageTransitionCurtain from "@/components/motion/PageTransitionCurtain";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isFirstMount = useRef(true);
  const [showCurtain, setShowCurtain] = useState(false);

  // Màn che chuyển cảnh giữa các trang (chỉ kích hoạt khi chuyển route, không chặn tải đầu)
  useEffect(() => {
    if (isAdmin) {
      setShowCurtain(false);
      return;
    }
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setShowCurtain(true);
    const timer = setTimeout(() => {
      setShowCurtain(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [pathname, isAdmin]);

  // Nếu là trang Admin, không chạy hiệu ứng chuyển cảnh để tránh kẹt giao diện
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      {/* Màn che chuyển cảnh xanh rêu + Circle Reveal + Tên trang & Logo */}
      <AnimatePresence mode="wait">
        {showCurtain && (
          <PageTransitionCurtain onComplete={() => setShowCurtain(false)} />
        )}
      </AnimatePresence>

      {/* Nội dung trang */}
      <div className="min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}

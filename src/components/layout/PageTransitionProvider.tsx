"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/wp-admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        className="w-full relative"
      >
        {/* Bức màn đen obsidian che màn hình và mở ra mượt mà khi chuyển trang */}
        <motion.div
          className="fixed inset-0 bg-[#0C0705] z-[99990] pointer-events-none"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          style={{ originY: 0 }}
        />

        {/* Viền vàng mảnh lướt qua */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent z-[99991] pointer-events-none"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          exit={{ scaleX: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}

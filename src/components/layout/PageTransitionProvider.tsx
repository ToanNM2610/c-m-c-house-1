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
  const isAdmin = pathname?.startsWith("/portal-camcu-2610") || pathname?.startsWith("/wp-admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="w-full relative"
        style={{
          willChange: "opacity, transform",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


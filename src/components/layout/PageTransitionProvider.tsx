"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: CINEMATIC_EASE as unknown as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: CINEMATIC_EASE as unknown as [number, number, number, number],
    },
  },
};

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin =
    pathname?.startsWith("/portal-camcu-2610") ||
    pathname?.startsWith("/wp-admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
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

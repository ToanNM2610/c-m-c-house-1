"use client";

import React, { useContext, useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useScene } from "@/context/SceneContext";

/**
 * FrozenRouter ensures that the exiting route's React Server Component context
 * and internal tree are preserved during the exit animation, preventing premature
 * re-renders or blank flashes before unmounting.
 */
function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  if (!LayoutRouterContext) {
    return <>{children}</>;
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

// Cubic bezier per Awwwards specification: cubic-bezier(0.645, 0.045, 0.355, 1)
const TRANSITION_EASE = [0.645, 0.045, 0.355, 1] as const;
const TRANSITION_DURATION = 0.8;

const variants4D: Variants = {
  initial: {
    rotateY: 90,
    z: -1000,
    opacity: 0,
    transformOrigin: "50% 50%",
    pointerEvents: "none",
  },
  animate: {
    rotateY: 0,
    z: 0,
    opacity: 1,
    transformOrigin: "50% 50%",
    pointerEvents: "auto",
    transition: {
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    },
  },
  exit: {
    rotateY: -90,
    z: -1000,
    opacity: 0,
    transformOrigin: "50% 50%",
    pointerEvents: "none",
    transition: {
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    },
  },
};

const reducedMotionVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

interface PageTransitionLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransitionLayout({
  children,
  className = "",
}: PageTransitionLayoutProps) {
  const pathname = usePathname() || "";
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Access SceneContext safely if available
  let sceneContext: ReturnType<typeof useScene> | null = null;
  try {
    sceneContext = useScene();
  } catch {
    sceneContext = null;
  }

  const { setIsTransitioning, setTransitionPhase } = sceneContext || {
    setIsTransitioning: () => {},
    setTransitionPhase: () => {},
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // When pathname changes, notify the 3D scene about route transition
  useEffect(() => {
    if (!mounted) return;
    setIsTransitioning(true);
    setTransitionPhase("exiting");
  }, [pathname, mounted, setIsTransitioning, setTransitionPhase]);

  const handleExitComplete = () => {
    // Reset scroll smoothly between exit and entrance
    if (typeof window !== "undefined") {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: { immediate?: boolean }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
    setTransitionPhase("entering");
  };

  // Don't apply 3D transitions in administrative / CMS portals
  const isAdmin = pathname.startsWith("/portal-camcu-2610") || pathname.startsWith("/wp-admin");
  if (isAdmin) {
    return <div className={`relative w-full min-h-screen z-10 ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`page-transition-perspective-root relative w-full min-h-screen overflow-x-hidden ${className}`}
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      }}
    >
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={handleExitComplete}
      >
        <motion.div
          key={pathname}
          variants={shouldReduceMotion ? reducedMotionVariants : variants4D}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={(definition) => {
            if (definition === "animate") {
              setIsTransitioning(false);
              setTransitionPhase("idle");
            }
          }}
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
          className="relative w-full min-h-screen z-10"
        >
          <FrozenRouter>
            {children}
          </FrozenRouter>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

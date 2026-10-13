"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<{
    text: string;
    variant: "default" | "hover" | "view" | "drag";
    visible: boolean;
  }>({
    text: "",
    variant: "default",
    visible: false,
  });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Chỉ kích hoạt trên desktop có chuột (pointer: fine) và không bật reduced motion
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || isReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!cursorState.visible) {
        setCursorState((prev) => ({ ...prev, visible: true }));
      }

      // Kiểm tra mục tiêu hover
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const dragTarget = target.closest("[data-cursor='drag'], .cursor-drag");
      const viewTarget = target.closest("[data-cursor='view'], .cursor-view, [data-lightbox], img");
      const interactiveTarget = target.closest("button, a, input, select, textarea, [role='button']");

      if (dragTarget) {
        setCursorState({ text: "Kéo", variant: "drag", visible: true });
      } else if (viewTarget) {
        setCursorState({ text: "Xem", variant: "view", visible: true });
      } else if (interactiveTarget) {
        setCursorState({ text: "", variant: "hover", visible: true });
      } else {
        setCursorState({ text: "", variant: "default", visible: true });
      }
    };

    const handleMouseLeave = () => {
      setCursorState((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorState.visible, mouseX, mouseY]);

  if (!cursorState.visible) return null;

  const isExpanded = cursorState.variant === "view" || cursorState.variant === "drag";

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center font-mono select-none"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: isExpanded ? 68 : cursorState.variant === "hover" ? 28 : 12,
        height: isExpanded ? 68 : cursorState.variant === "hover" ? 28 : 12,
        backgroundColor: isExpanded
          ? "rgba(168, 69, 42, 0.90)" // basalt fill
          : cursorState.variant === "hover"
          ? "rgba(168, 69, 42, 0.25)"
          : "var(--basalt)",
        border: isExpanded
          ? "2px solid rgba(253, 251, 247, 0.8)"
          : cursorState.variant === "hover"
          ? "1.5px solid var(--basalt)"
          : "none",
        backdropFilter: isExpanded ? "blur(4px)" : "none",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {isExpanded && (
        <span className="text-white text-[12px] font-bold uppercase tracking-wider">
          {cursorState.text}
        </span>
      )}
    </motion.div>
  );
}

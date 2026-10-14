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

  // Chấm tâm theo nhanh
  const dotSpringConfig = { damping: 30, stiffness: 450, mass: 0.3 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // Vầng sáng ember 160px đi trễ nhẹ tạo cảm giác ánh lửa
  const glowSpringConfig = { damping: 25, stiffness: 180, mass: 0.8 };
  const glowX = useSpring(mouseX, glowSpringConfig);
  const glowY = useSpring(mouseY, glowSpringConfig);

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

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const dragTarget = target.closest("[data-cursor='drag'], .cursor-drag");
      const viewTarget = target.closest("[data-cursor='view'], .cursor-view, [data-lightbox], img");
      const interactiveTarget = target.closest("button, a, input, select, textarea, [role='button']");

      if (dragTarget) {
        setCursorState({ text: "KÉO", variant: "drag", visible: true });
      } else if (viewTarget) {
        setCursorState({ text: "XEM", variant: "view", visible: true });
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

  return (
    <>
      {/* 1. Màng hạt phim (Film Grain) 4% toàn trang */}
      <div
        className="fixed inset-0 pointer-events-none z-[99990] opacity-[0.04] select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* 2. Vầng sáng ember 160px đi trễ */}
      {cursorState.visible && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[99991] w-[160px] h-[160px] rounded-full blur-[20px] select-none"
          style={{
            x: glowX,
            y: glowY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(255, 106, 43, 0.24) 0%, rgba(255, 106, 43, 0.08) 45%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. Con trỏ chấm 10px / Vòng XEM / KÉO */}
      {cursorState.visible && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center font-mono select-none"
          style={{
            x: dotX,
            y: dotY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            width:
              cursorState.variant === "view" || cursorState.variant === "drag"
                ? 72
                : cursorState.variant === "hover"
                ? 24
                : 10,
            height:
              cursorState.variant === "view" || cursorState.variant === "drag"
                ? 72
                : cursorState.variant === "hover"
                ? 24
                : 10,
            backgroundColor:
              cursorState.variant === "view" || cursorState.variant === "drag"
                ? "rgba(255, 106, 43, 0.92)"
                : cursorState.variant === "hover"
                ? "rgba(255, 106, 43, 0.25)"
                : "var(--ember)",
            border:
              cursorState.variant === "view" || cursorState.variant === "drag"
                ? "2px solid #FFFFFF"
                : cursorState.variant === "hover"
                ? "1.5px solid var(--ember)"
                : "none",
            backdropFilter:
              cursorState.variant === "view" || cursorState.variant === "drag"
                ? "blur(6px)"
                : "none",
          }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
        >
          {(cursorState.variant === "view" || cursorState.variant === "drag") && (
            <span className="text-[#0A0E0C] text-[12px] font-bold tracking-widest uppercase">
              {cursorState.text}
            </span>
          )}
        </motion.div>
      )}
    </>
  );
}

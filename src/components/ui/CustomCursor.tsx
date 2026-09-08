"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/portal-camcu-2610") || pathname.startsWith("/wp-admin");

  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isHeadingHovered, setIsHeadingHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Vị trí chuột thực tế
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics mượt mà cho vòng ngoài (follower)
  const springConfig = { damping: 26, stiffness: 340, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Không kích hoạt Custom Cursor trong khu vực Admin
    if (isAdmin) {
      setIsVisible(false);
      return;
    }

    // Tắt trên màn hình mobile (< 768px) và mọi thiết bị cảm ứng
    const isMobileOrTouch =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    if (isMobileOrTouch) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Nhận diện text tiêu đề lớn hoặc phần tử có data-cursor-diff
      const headingEl = target.closest("h1, h2, [data-cursor-diff], .cursor-diff");
      const interactiveEl = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
      const textEl = target.closest("[data-cursor-text]") as HTMLElement | null;

      if (textEl && textEl.dataset.cursorText) {
        setCursorText(textEl.dataset.cursorText);
        setIsHovered(true);
        setIsHeadingHovered(false);
      } else if (headingEl) {
        setCursorText("");
        setIsHovered(true);
        setIsHeadingHovered(true);
      } else if (interactiveEl) {
        setCursorText("");
        setIsHovered(true);
        setIsHeadingHovered(false);
      } else {
        setCursorText("");
        setIsHovered(false);
        setIsHeadingHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isAdmin]);

  if (isAdmin || !isVisible) return null;

  const hasText = cursorText.length > 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Vòng ngoài với hiệu ứng difference khi hover text lớn chuẩn Awwwards */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: isHeadingHovered ? "difference" : "normal",
        }}
        animate={{
          scale: isClicking ? 0.85 : 1,
          width: hasText ? 84 : isHeadingHovered ? 78 : isHovered ? 48 : 28,
          height: hasText ? 84 : isHeadingHovered ? 78 : isHovered ? 48 : 28,
          backgroundColor: isHeadingHovered
            ? "#FFFFFF"
            : hasText
            ? "rgba(212, 175, 55, 0.95)"
            : isHovered
            ? "rgba(212, 175, 55, 0.15)"
            : "rgba(212, 175, 55, 0.04)",
          borderColor: isHeadingHovered
            ? "transparent"
            : hasText
            ? "#D4AF37"
            : isHovered
            ? "#D4AF37"
            : "rgba(212, 175, 55, 0.4)",
        }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 rounded-full border flex items-center justify-center pointer-events-none"
      >
        {hasText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-[10px] font-sans font-bold text-[#1A0F0A] uppercase tracking-wider text-center px-1 select-none"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Điểm tâm bám sát chuột khi không ở chế độ difference */}
      {!hasText && !isHeadingHovered && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: isHovered ? 0.4 : isClicking ? 0.6 : 1,
            opacity: isHovered ? 0.4 : 1,
          }}
          transition={{ duration: 0.1 }}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
        />
      )}
    </div>
  );
}


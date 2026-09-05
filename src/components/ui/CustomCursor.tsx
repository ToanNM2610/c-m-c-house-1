"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/wp-admin");

  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Vị trí chuột thực tế
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics mượt mà cho vòng ngoài (follower)
  const springConfig = { damping: 28, stiffness: 320, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Tuyệt đối không kích hoạt Custom Cursor trong khu vực Admin
    if (isAdmin) {
      setIsVisible(false);
      return;
    }

    // Chỉ bật trên thiết bị có chuột (không phải màn hình cảm ứng)
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Kiểm tra phần tử đang được hover
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
      const textEl = target.closest("[data-cursor-text]") as HTMLElement | null;

      if (textEl && textEl.dataset.cursorText) {
        setCursorText(textEl.dataset.cursorText);
        setIsHovered(true);
      } else if (interactiveEl) {
        setCursorText("");
        setIsHovered(true);
      } else {
        setCursorText("");
        setIsHovered(false);
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

  // Nếu là trang Admin hoặc chưa sẵn sàng thì không render bất kỳ DOM nào
  if (isAdmin || !isVisible) return null;

  const hasText = cursorText.length > 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Follower ngoài: vòng tròn mở rộng hoặc badge chữ */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.85 : hasText ? 1 : isHovered ? 1.6 : 1,
          width: hasText ? 80 : 34,
          height: hasText ? 80 : 34,
          backgroundColor: hasText
            ? "rgba(197, 168, 128, 0.95)"
            : isHovered
            ? "rgba(197, 168, 128, 0.2)"
            : "rgba(197, 168, 128, 0)",
          borderColor: hasText
            ? "#C5A880"
            : isHovered
            ? "#C5A880"
            : "rgba(197, 168, 128, 0.45)",
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 rounded-full border border-[#C5A880] flex items-center justify-center backdrop-blur-[1px] shadow-[0_0_20px_rgba(197,168,128,0.15)]"
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

      {/* Chấm tròn trung tâm màu vàng #C5A880 bám sát chuột */}
      {!hasText && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: isHovered ? 0.4 : isClicking ? 0.6 : 1,
            opacity: isHovered ? 0.5 : 1,
          }}
          transition={{ duration: 0.1 }}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C5A880] shadow-[0_0_8px_#C5A880]"
        />
      )}
    </div>
  );
}

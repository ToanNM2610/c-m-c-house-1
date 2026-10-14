"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hoverState, setHoverState] = useState<{
    text: string;
    showRing: boolean;
  }>({
    text: "",
    showRing: false,
  });

  const [isTouchOrDisabled, setIsTouchOrDisabled] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Vầng sáng kem 120px bám sát chuột đúng vị trí, trễ < 80ms
  const glowSpringConfig = { damping: 40, stiffness: 850, mass: 0.1 };
  const glowX = useSpring(mouseX, glowSpringConfig);
  const glowY = useSpring(mouseY, glowSpringConfig);

  // Vòng Xem/Kéo bám sát chuột
  const ringSpringConfig = { damping: 35, stiffness: 600, mass: 0.15 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Kiểm tra thiết bị cảm ứng hoặc prefers-reduced-motion
    const checkDisabled = () => {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isHoverable = window.matchMedia("(hover: hover)").matches;
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      return !isFinePointer || !isHoverable || isReduced;
    };

    if (checkDisabled()) {
      setIsTouchOrDisabled(true);
      return;
    }

    // 2. Theo dõi trạng thái Lightbox mở / đóng
    const checkLightbox = () => {
      const open =
        document.body.classList.contains("lightbox-open") ||
        document.body.getAttribute("data-lightbox-active") === "true";
      setIsLightboxOpen(open);
    };

    const observer = new MutationObserver(() => {
      checkLightbox();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-lightbox-active"],
    });

    // 3. Xử lý di chuyển chuột
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Chỉ hiện vòng Xem/Kéo khi rê chuột vào ảnh hoặc vùng xem ảnh
      const dragTarget = target.closest("[data-cursor='drag'], .cursor-drag");
      const viewTarget = target.closest(
        "[data-cursor='view'], .cursor-view, [data-lightbox], img, figure"
      );

      if (dragTarget) {
        setHoverState({ text: "KÉO", showRing: true });
      } else if (viewTarget) {
        setHoverState({ text: "XEM", showRing: true });
      } else {
        if (hoverState.showRing) {
          setHoverState({ text: "", showRing: false });
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setHoverState({ text: "", showRing: false });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, hoverState.showRing, mouseX, mouseY]);

  // Tắt hoàn toàn trên cảm ứng, khi reduced motion hoặc khi mở lightbox
  if (isTouchOrDisabled || isLightboxOpen || !isVisible) {
    return null;
  }

  return (
    <>
      {/* 1. Vầng sáng kem rất nhẹ (tròn, 120px, độ mờ .10, z-index dưới nội dung, pointer-events: none) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10] w-[120px] h-[120px] rounded-full select-none"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(250, 246, 238, 0.10) 0%, rgba(244, 238, 226, 0.05) 50%, transparent 75%)",
          filter: "blur(14px)",
        }}
        aria-hidden="true"
      />

      {/* 2. Chỉ hiện vòng Xem/Kéo khi rê vào ảnh (không có dot hệ thống thay thế con trỏ) */}
      {hoverState.showRing && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center font-mono select-none w-16 h-16 rounded-full bg-[#121A15]/85 border border-[#FAF6EE]/40 text-[#FAF6EE] backdrop-blur-md shadow-xl"
          style={{
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          aria-hidden="true"
        >
          <span className="text-[11px] font-bold tracking-widest uppercase">
            {hoverState.text}
          </span>
        </motion.div>
      )}
    </>
  );
}

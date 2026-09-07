"use client";

import { useRef, useCallback, useEffect } from "react";

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

export default function CardTilt({ children, className = "", cardClassName = "" }: CardTiltProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const MAX = 14; // peak tilt in degrees at the card edges

  const reset = useCallback(() => {
    if (!tiltRef.current || !cardRef.current) return;
    tiltRef.current.classList.remove("is-hover");
    cardRef.current.classList.remove("is-tilting");
    cardRef.current.style.setProperty("--tilt-rx", "0deg");
    cardRef.current.style.setProperty("--tilt-ry", "0deg");
  }, []);

  const track = useCallback((e: PointerEvent) => {
    if (!tiltRef.current || !cardRef.current) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    
    const r = tiltRef.current.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    
    tiltRef.current.classList.add("is-hover");
    cardRef.current.classList.add("is-tilting");
    cardRef.current.style.setProperty("--tilt-ry", ((px - 0.5) * MAX).toFixed(2) + "deg");
    cardRef.current.style.setProperty("--tilt-rx", ((0.5 - py) * MAX).toFixed(2) + "deg");
    cardRef.current.style.setProperty("--tilt-gx", (px * 100).toFixed(1) + "%");
    cardRef.current.style.setProperty("--tilt-gy", (py * 100).toFixed(1) + "%");
  }, []);

  useEffect(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;

    // Trên thiết bị cảm ứng hoặc màn hình mobile, tắt hoàn toàn để cuộn trang mượt mà không bị khựng đơ
    const isTouchOrMobile =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    if (isTouchOrMobile) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") track(e);
    };
    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") reset();
    };

    tilt.addEventListener("pointermove", handlePointerMove as EventListener);
    tilt.addEventListener("pointerleave", handlePointerLeave as EventListener);

    return () => {
      tilt.removeEventListener("pointermove", handlePointerMove as EventListener);
      tilt.removeEventListener("pointerleave", handlePointerLeave as EventListener);
    };
  }, [track, reset]);

  return (
    <div ref={tiltRef} className={`t-tilt ${className}`}>
      <div ref={cardRef} className={`t-tilt-card ${cardClassName}`}>
        {children}
        <div className="t-tilt-glare" />
      </div>
    </div>
  );
}

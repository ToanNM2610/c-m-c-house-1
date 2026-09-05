"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/wp-admin");
  const isIgnored = isAdmin;

  useEffect(() => {
    // Nếu là trang Admin: Hủy Lenis để trả về cuộn tự nhiên của trình duyệt
    if (isIgnored) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete (window as any).__lenis;
      }
      return;
    }

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const lenis = new Lenis({
      lerp: 0.09,
      duration: 1.2,
      smoothWheel: !isTouch,
      syncTouch: false,
      autoResize: true,
      orientation: "vertical",
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).__lenis;
    };
  }, [isIgnored]);

  useEffect(() => {
    if (!isIgnored && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname, isIgnored]);

  return <>{children}</>;
}

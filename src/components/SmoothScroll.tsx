"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/wp-admin");

  useEffect(() => {
    // Tắt hoàn toàn Lenis trên Admin hoặc trên thiết bị cảm ứng / màn hình di động (< 768px)
    // để tránh xung đột cuộn dọc tự nhiên trên mobile/tablet
    const isMobileOrTouch =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    if (isAdmin || isMobileOrTouch) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete (window as any).__lenis;
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Cấu hình Lenis mượt, nhẹ (duration: 1.0, smoothWheel: true, touchMultiplier: 1.5)
    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      touchMultiplier: 1.5,
      syncTouch: false,
      autoResize: true,
      orientation: "vertical",
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    // Đồng bộ hoàn hảo giữa Lenis và GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).__lenis;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname, isAdmin]);

  return <>{children}</>;
}

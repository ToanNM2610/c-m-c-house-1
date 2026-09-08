"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type CanvasSceneMode = "celestial" | "about" | "globe" | "ambient" | "none";

interface CanvasContextValue {
  sceneMode: CanvasSceneMode;
  setSceneMode: (mode: CanvasSceneMode) => void;
  scrollProgressRef: React.MutableRefObject<number>;
  setScrollProgress: (val: number) => void;
  isAutoSpin: boolean;
  setIsAutoSpin: (val: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const [sceneMode, setSceneMode] = useState<CanvasSceneMode>("celestial");
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const scrollProgressRef = useRef<number>(0);

  // Nhận diện thiết bị Mobile / Touch
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        Boolean(
          typeof window !== "undefined" &&
            (window.innerWidth < 768 ||
              window.matchMedia("(pointer: coarse)").matches ||
              "ontouchstart" in window ||
              (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))
        )
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Tự động đồng bộ chế độ Scene 3D theo route hiện tại
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/wp-admin")) {
      setSceneMode("none");
    } else if (pathname === "/contact") {
      setSceneMode("globe");
    } else if (pathname === "/about") {
      setSceneMode("about");
    } else if (pathname === "/") {
      setSceneMode("celestial");
    } else {
      setSceneMode("ambient");
    }
  }, [pathname]);

  const setScrollProgress = (val: number) => {
    scrollProgressRef.current = val;
  };

  const value = useMemo(
    () => ({
      sceneMode,
      setSceneMode,
      scrollProgressRef,
      setScrollProgress,
      isAutoSpin,
      setIsAutoSpin,
      isMobile,
    }),
    [sceneMode, isAutoSpin, isMobile]
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

export type TransitionMode =
  | "stagger-panels" // 3 lớp màu nối tiếp (#3E2723 → #4A5D23 → #CC7755)
  | "curtain-wipe"    // Màn che nâu #3E2723 trượt lên hiện logo
  | "slide-directional" // Tới trang sau trượt sang trái, quay lại trượt sang phải
  | "cross-fade"      // Mờ dần trên nền kem #FDFBF7
  | "depth-push";     // Trang cũ lùi sâu scale 0.9 + mờ, trang mới trượt đè lên

interface TransitionContextType {
  mode: TransitionMode;
  setMode: (mode: TransitionMode) => void;
  direction: number; // 1: Next (tiến tới), -1: Prev (quay lại)
  clickCoords: { x: number; y: number } | null;
  triggerCircleReveal: (x: number, y: number) => void;
}

const ROUTE_ORDER = ["/", "/about", "/space", "/menu", "/contact"];

const TransitionContext = createContext<TransitionContextType>({
  mode: "stagger-panels",
  setMode: () => {},
  direction: 1,
  clickCoords: null,
  triggerCircleReveal: () => {},
});

export const useTransitionContext = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: ReactNode }) {
  // Mặc định chọn Mode 3: Stagger panels 3 lớp màu di sản theo khuyến nghị
  const [mode, setModeState] = useState<TransitionMode>("stagger-panels");
  const [prevPath, setPrevPath] = useState<string>("/");
  const [direction, setDirection] = useState<number>(1);
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number } | null>(null);

  const pathname = usePathname();

  // Đọc chế độ đã lưu từ localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("camcu_transition_mode") as TransitionMode | null;
    if (saved && ["stagger-panels", "curtain-wipe", "slide-directional", "cross-fade", "depth-push"].includes(saved)) {
      setModeState(saved);
    }
  }, []);

  const setMode = (newMode: TransitionMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("camcu_transition_mode", newMode);
    }
  };

  // Tự động tính toán hướng di chuyển (Directional Awareness)
  useEffect(() => {
    if (!pathname) return;

    const prevIndex = ROUTE_ORDER.indexOf(prevPath);
    const currIndex = ROUTE_ORDER.indexOf(pathname);

    if (prevIndex !== -1 && currIndex !== -1) {
      if (currIndex > prevIndex) {
        setDirection(1); // Đi tới trang sau -> trượt sang trái
      } else if (currIndex < prevIndex) {
        setDirection(-1); // Quay lại trang trước -> trượt sang phải
      } else {
        setDirection(1);
      }
    } else {
      setDirection(1);
    }

    setPrevPath(pathname);
  }, [pathname, prevPath]);

  const triggerCircleReveal = (x: number, y: number) => {
    setClickCoords({ x, y });
    setTimeout(() => setClickCoords(null), 800);
  };

  return (
    <TransitionContext.Provider
      value={{
        mode,
        setMode,
        direction,
        clickCoords,
        triggerCircleReveal,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

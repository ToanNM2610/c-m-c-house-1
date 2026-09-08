"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import SceneController from "./SceneController";

export default function GlobalCanvas() {
  const [mounted, setMounted] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    setMounted(true);
    // Nhận diện thiết bị di động / màn hình nhỏ / GPU yếu
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    setIsLowPower(!!isMobile);
  }, []);

  // Không hiển thị Canvas trong giao diện Admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/wp-admin")) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  return (
    <div
      id="global-canvas-container"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0C0D0B",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={isLowPower ? [1, 1] : [1, 1.5]}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: true,
          depth: true,
          stencil: false,
        }}
        className="w-full h-full pointer-events-none"
      >
        <SceneController />
      </Canvas>
    </div>
  );
}

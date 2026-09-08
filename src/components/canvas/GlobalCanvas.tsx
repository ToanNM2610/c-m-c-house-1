"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { usePathname } from "next/navigation";
import SceneController from "./SceneController";

export default function GlobalCanvas() {
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState(1);
  const pathname = usePathname() || "";

  useEffect(() => {
    setMounted(true);
    // Set initial DPR based on device capability
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));
    setDpr(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
  }, []);

  // PerformanceMonitor callbacks for adaptive quality
  const handleIncline = useCallback(() => {
    setDpr((prev) => Math.min(prev + 0.25, 1.5));
  }, []);

  const handleDecline = useCallback(() => {
    setDpr((prev) => Math.max(prev - 0.25, 0.75));
  }, []);

  // Don't render Canvas in Admin area
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
        backgroundColor: "#0a0908",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={dpr}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: true,
          depth: true,
          stencil: false,
          failIfMajorPerformanceCaveat: false,
        }}
        frameloop="always"
        className={`w-full h-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
          (pathname === "/space" || pathname === "/menu") ? "opacity-15" : "opacity-100"
        }`}
      >
        {/* Adaptive performance: auto-adjust DPR based on FPS */}
        <PerformanceMonitor
          onIncline={handleIncline}
          onDecline={handleDecline}
          flipflops={3}
          bounds={(refreshrate) => [refreshrate * 0.5, refreshrate * 0.9]}
        />
        <SceneController />
      </Canvas>
    </div>
  );
}
